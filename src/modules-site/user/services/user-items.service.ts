import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Brackets, Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import type { GetItemsFromUserResponseDto } from '../dtos-response'

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getItemsFromUser(id: number): Promise<GetItemsFromUserResponseDto[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.lot', 'lot') // Присоединяем таблицу `lot` для использования в условиях
      .where('item.userId = :id', { id })
      .andWhere('item.itemTicketId IS NULL')
      .andWhere('item.isTaken = false')
      .andWhere('item.shulkerId IS NULL')
      .andWhere(
        new Brackets(qb => {
          qb.where('item.lotId IS NULL').orWhere('lot.isSold = true')
        }),
      )
      .select([
        'id',
        'amount',
        'categories',
        'description',
        'display_name',
        'durability',
        'enchants',
        'type',
      ])
      .getMany()
  }
}
