import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { In, Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventoryService } from 'src/modules-site/user-inventory/services'

import type {
  CreateItemTicketResponseDto,
  DeleteItemTicketResponseDto,
  GetItemsFromTicketResponseDto,
  RemoveItemsFromTicketResponseDto,
} from '../dtos-response'
import type { DeleteItemTicketProps } from '../types'

@Injectable()
export class ItemTicketService {
  constructor(
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly userInventoryService: UserInventoryService,
  ) {}

  async getItemTickets(id: number): Promise<ItemTicket[]> {
    return this.itemTicketRepository.find({
      where: { inventory: { id } },
    })
  }

  async getItemsFromTicket(
    userInventory: number,
    itemTicketId: number,
  ): Promise<GetItemsFromTicketResponseDto[]> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId, inventory: { id: userInventory } },
    })

    if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

    return this.itemRepository.find({
      where: { itemTicket: { id: itemTicketId } },
      select: [
        'id',
        'amount',
        'type',
        'display_name',
        'description',
        'enchants',
        'categories',
      ],
    })
  }

  async createItemTicket(
    itemIds: number[],
    userInventoryId: number,
  ): Promise<CreateItemTicketResponseDto> {
    const coune = await this.itemTicketRepository.count({
      where: {
        inventory: {
          id: userInventoryId,
        },
      },
    })

    if (coune >= 5) {
      throw new HttpException(
        '{"messages":["У вас може бути","тільки 5 квитків"]}',
        HttpStatus.BAD_REQUEST,
      )
    }

    const arrayItems = await this.itemRepository
      .createQueryBuilder('items')
      .whereInIds(itemIds)
      .andWhere('items.inventory.id = :userInventoryId', { userInventoryId })
      .andWhere('items.itemTicket IS NULL')
      .getMany()

    if (!(arrayItems.length === itemIds.length)) {
      throw new NotFoundException('Предмет не знайдено')
    }

    const newItemTicket = this.itemTicketRepository.create()

    const updatedItems = arrayItems.map((itemData: Item) => {
      return {
        ...itemData,
        itemTicket: newItemTicket,
      }
    })

    const userInventory =
      await this.userInventoryService.getUserInvenory(userInventoryId)

    newItemTicket.inventory = userInventory
    newItemTicket.items = updatedItems

    await this.itemTicketRepository.save(newItemTicket)

    return { id: newItemTicket.id, items: itemIds }
  }

  async removeItemsFromTicket(
    itemIds: number[],
    userInventoryId: number,
  ): Promise<RemoveItemsFromTicketResponseDto[]> {
    const itemsCount = await this.itemRepository.count({
      where: { id: In(itemIds), inventory: { id: userInventoryId } },
    })

    if (itemsCount < itemIds.length)
      throw new NotFoundException('Предмет не знайдено')

    await this.itemRepository.update(
      { id: In(itemIds), inventory: { id: userInventoryId } },
      { itemTicket: null },
    )

    return this.itemRepository.find({
      where: { id: In(itemIds), inventory: { id: userInventoryId } },
      select: [
        'id',
        'amount',
        'type',
        'display_name',
        'description',
        'enchants',
        'categories',
      ],
    })
  }

  async deleteItemTicket({
    itemIds,
    userInventoryId,
    itemTicketId,
  }: DeleteItemTicketProps): Promise<DeleteItemTicketResponseDto[]> {
    const itemsIsExist = await this.itemRepository.count({
      where: { id: In(itemIds), inventory: { id: userInventoryId } },
    })

    if (itemsIsExist !== itemIds.length) {
      throw new NotFoundException('Предмет не знайдено')
    }

    const deletedItemTicket =
      await this.itemTicketRepository.delete(itemTicketId)

    if (deletedItemTicket.affected !== 1) {
      throw new NotFoundException('Квиток не знайдено')
    }

    return this.itemRepository.find({
      where: { id: In(itemIds), inventory: { id: userInventoryId } },
      select: [
        'id',
        'amount',
        'type',
        'display_name',
        'description',
        'enchants',
        'categories',
      ],
    })
  }
}
