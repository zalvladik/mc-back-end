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
import { User } from 'src/entities/user.entity'

import { Lot } from 'src/entities/lot.entity'
import type {
  CreateItemTicketResponseDto,
  GetItemsFromTicketResponseDto,
  RemoveItemsFromTicketResponseDto,
} from '../dtos-response'
import type { DeleteItemTicketProps } from '../types'

@Injectable()
export class ItemTicketService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async getItemTickets(id: number): Promise<ItemTicket[]> {
    return this.itemTicketRepository.find({
      where: { user: { id } },
    })
  }

  async getItemsFromTicket(
    userId: number,
    itemTicketId: number,
  ): Promise<GetItemsFromTicketResponseDto[]> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId, user: { id: userId } },
    })

    if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

    return this.itemRepository.find({
      where: { itemTicket: { id: itemTicketId } },
      select: [],
    })
  }

  async createItemTicket(
    itemIds: number[],
    userId: number,
  ): Promise<CreateItemTicketResponseDto> {
    const coune = await this.itemTicketRepository.count({
      where: {
        user: {
          id: userId,
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
      .leftJoinAndSelect('items.lot', 'lot')
      .whereInIds(itemIds)
      .andWhere('items.user.id = :userId', { userId })
      .andWhere('items.itemTicket IS NULL')
      .getMany()

    if (!(arrayItems.length === itemIds.length)) {
      throw new NotFoundException('Предмет не знайдено')
    }

    const newItemTicket = this.itemTicketRepository.create()

    const itemLotIds: number[] = []

    const updatedItems = arrayItems.map((itemData: Item) => {
      if (itemData.lot) {
        itemLotIds.push(itemData.lot.id)
      }

      return {
        ...itemData,
        itemTicket: newItemTicket,
        lot: null,
      }
    })

    const user = await this.userRepository.findOne({
      where: { id: userId },
    })

    newItemTicket.user = user
    newItemTicket.items = updatedItems

    await this.itemRepository.save(updatedItems)

    await this.itemTicketRepository.save(newItemTicket)

    if (itemLotIds.length) {
      await this.lotRepository.delete(itemLotIds)
    }

    return { id: newItemTicket.id }
  }

  async removeItemsFromTicket(
    itemIds: number[],
    userId: number,
  ): Promise<RemoveItemsFromTicketResponseDto[]> {
    const itemsCount = await this.itemRepository.count({
      where: { id: In(itemIds), user: { id: userId } },
    })

    if (itemsCount < itemIds.length)
      throw new NotFoundException('Предмет не знайдено')

    await this.itemRepository.update(
      { id: In(itemIds), user: { id: userId } },
      { itemTicket: null },
    )

    return this.itemRepository.find({
      where: { id: In(itemIds), user: { id: userId } },
      select: [
        'id',
        'amount',
        'categories',
        'description',
        'display_name',
        'durability',
        'enchants',
        'type',
        'lot',
      ],
    })
  }

  async deleteItemTicket({
    userId,
    itemTicketId,
  }: DeleteItemTicketProps): Promise<void> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId },
      relations: ['items'],
    })

    const itemIds = itemTicket.items.map(item => item.id)

    const itemsIsExist = await this.itemRepository.count({
      where: { id: In(itemIds), user: { id: userId } },
    })

    if (itemsIsExist !== itemIds.length) {
      throw new NotFoundException('Предмет не знайдено')
    }

    const deletedItemTicket =
      await this.itemTicketRepository.delete(itemTicketId)

    if (deletedItemTicket.affected !== 1) {
      throw new NotFoundException('Квиток не знайдено')
    }
  }
}
