import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventory } from 'src/entities/user-inventory.entity'
import type { ItemDto } from 'src/modules-mc/user-inventory/dtos-request'
import { enchantmentDescription } from 'src/shared/helpers/enchantments'
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import type { PullItemsFromInventoryResponseDto } from '../dtos-responses'

@Injectable()
export class UserInventoryItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(UserInventory)
    private readonly userInventoryRepository: Repository<UserInventory>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
  ) {}

  async addItemsToInventory(
    itemsData: ItemDto[],
    realname: string,
  ): Promise<void> {
    const userInventory = await this.userInventoryRepository.findOne({
      where: { realname },
    })

    if (!userInventory) throw new NotFoundException('Гравця не знайдено')

    try {
      const items = itemsData.map(
        (item: ItemDto & { description: string[] | null }) => {
          const { display_name, categories, description } =
            itemCategoriesSorter(item.type)

          let result = {
            ...item,
            inventory: userInventory,
            display_name: item.display_name || display_name,
            categories,
          }

          if (description) result = { ...result, description }

          if (item.enchants?.length) {
            const enchants = enchantmentDescription(item.enchants)

            result = { ...result, enchants }
          }

          return result
        },
      )

      await this.itemRepository.save(items)
    } catch (error) {
      throw new BadRequestException('Предмет не знайдено')
    }
  }

  async pullItemsFromInventory(
    itemTicketId: number,
  ): Promise<PullItemsFromInventoryResponseDto> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId },
      relations: ['items'],
    })

    if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

    await this.itemTicketRepository.remove(itemTicket)
    await this.itemRepository.remove(itemTicket.items)

    const data = itemTicket.items.map(item => item.serialized)

    return { data }
  }
}
