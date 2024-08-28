import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { TradeHistory } from 'src/entities/trade-history.entity'
import type { GetTradeHistoryService } from '../types'

@Injectable()
export class LotTradeHistoryService {
  private tradeHistory = ['tradeHistory.id', 'tradeHistory.tradeTime']

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
    @InjectRepository(TradeHistory)
    private readonly tradeHistoryRepository: Repository<TradeHistory>,
  ) {}

  async getTradeHistory({
    userId,
    page = 1,
    limit = 10,
    isSeller = false,
  }: GetTradeHistoryService): Promise<any> {
    const select = [
      ...this.tradeHistory,
      ...this.selectLote,
      ...this.selectShulker,
    ]

    const queryBuilder = this.tradeHistoryRepository
      .createQueryBuilder('tradeHistory')
      .leftJoinAndSelect('tradeHistory.lot', 'lot')
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)
      .orderBy('tradeHistory.tradeTime', 'DESC')

    if (isSeller) {
      queryBuilder.andWhere('tradeHistory.seller.id = :userId', { userId })
    } else {
      queryBuilder.andWhere('tradeHistory.buyer.id = :userId', { userId })
    }

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots,
    }
  }
}
