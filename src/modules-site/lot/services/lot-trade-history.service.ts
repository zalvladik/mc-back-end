import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Lot } from 'src/entities/lot.entity'

import { User } from 'src/entities/user.entity'
import type { GetTradeHistoryService } from '../types'

@Injectable()
export class LotTradeHistoryService {
  private selectLote = [
    'lot',
    'item.id',
    'item.amount',
    'item.type',
    'item.display_name',
    'item.description',
    'item.enchants',
    'item.categories',
    'item.durability',
  ]

  private selectShulker = [
    'shulker.id',
    'shulker.username',
    'shulker.categories',
    'shulker.type',
    'shulker.display_name',
  ]

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async getTradeHistory({
    userId,
    page = 1,
    limit = 10,
    isSeller = false,
    username,
  }: GetTradeHistoryService): Promise<any> {
    const select = [...this.selectLote, ...this.selectShulker]

    const queryBuilder = this.lotRepository.createQueryBuilder('lot')

    queryBuilder
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .leftJoinAndSelect('lot.tradeHistory', 'tradeHistory')
      .leftJoinAndSelect('shulker.items', 'shulkerItem')
      .andWhere('lot.isSold = :isSold', { isSold: true })
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)

    if (isSeller) {
      queryBuilder.andWhere('lot.username = :username', { username })
    } else {
      queryBuilder
        .leftJoinAndSelect('tradeHistory.buyer', 'buyer')
        .andWhere('buyer.id = :userId', { userId })
    }

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots,
    }
  }
}
