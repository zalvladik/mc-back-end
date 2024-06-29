import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { User } from 'src/entities/user.entity'
import type { ItemDto } from 'src/modules-mc/user/dtos-request'
import { enchantmentDescription } from 'src/shared/helpers/enchantments'
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import type { PullItemsFromUserResponseDto } from '../dtos-responses'

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
  ) {}

  async addItemsToUser(itemsData: ItemDto[], username: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { username },
    })

    if (!user) throw new NotFoundException('Гравця не знайдено')

    const itemCount = await this.itemRepository.count({
      where: { user },
    })

    if (itemCount ?? 0 + itemsData.length > 27 * user.countShulker * 27) {
      throw new BadRequestException(
        `У вас замало місця на аккаунті, максимально ${user.countShulker} шлк.`,
      )
    }

    try {
      const items = itemsData.map(
        (item: ItemDto & { description: string[] | null }) => {
          const { display_name, categories, description } =
            itemCategoriesSorter(item.type)

          let result = {
            ...item,
            user,
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

  async pullItemsFromUser(
    itemTicketId: number,
  ): Promise<PullItemsFromUserResponseDto> {
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
