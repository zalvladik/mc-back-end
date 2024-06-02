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

@Injectable()
export class UserInventoryService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(UserInventory)
    private readonly userInventoryRepository: Repository<UserInventory>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
  ) {}

  async getUserInvenory(
    id: number,
    relations?: string[],
  ): Promise<UserInventory> {
    return this.userInventoryRepository.findOne({
      where: { id },
      relations: relations ?? ['items', 'itemTickets'],
    })
  }

  async updateUserInventory(userInventory: UserInventory): Promise<void> {
    await this.userInventoryRepository.save(userInventory)
  }

  async findUserInventoryById(inventoryId: number): Promise<UserInventory> {
    const userInventory = await this.userInventoryRepository.findOne({
      where: { id: inventoryId },
      relations: ['items'],
    })

    if (!userInventory) throw new NotFoundException('User inventory not found')

    return userInventory
  }

  async addItemsToInventory(
    itemsData: ItemDto[],
    realname: string,
  ): Promise<void> {
    const userInventory = await this.userInventoryRepository.findOne({
      where: { realname },
    })

    if (!userInventory) throw new NotFoundException('User not found')

    try {
      const items = itemsData.map((item: ItemDto) => {
        const { display_name, categories, description } = itemCategoriesSorter(
          item.type,
        )

        const result = {
          ...item,
          inventory: userInventory,
          display_name: item.display_name || display_name,
          categories,
          description,
        }

        if (item.enchants || item.stored_enchants) {
          const description = enchantmentDescription(
            item.enchants || item.stored_enchants,
          )

          return { ...result, description }
        }

        return result
      })

      await this.itemRepository.save(items)
    } catch (error) {
      throw new BadRequestException('Item not found')
    }
  }
}
