import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { TradeHistory } from 'src/entities/trade-history.entity'

import type {
  GetTradeHistoryService,
  getTradeHistoryWithTimeRange,
} from '../types'
import type { GetTradeHistoryWithTimeRangeResponse } from '../dtos-response'

@Injectable()
export class LotTradeHistoryService {
  private tradeHistory = ['tradeHistory.id', 'tradeHistory.createdAt']

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
      .orderBy('tradeHistory.createdAt', 'DESC')

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

  async getTradeHistoryWithTimeRange({
    from,
    to,

    userId,
  }: getTradeHistoryWithTimeRange): Promise<
    GetTradeHistoryWithTimeRangeResponse[]
  > {
    const queryBuilder = this.tradeHistoryRepository
      .createQueryBuilder('tradeHistory')
      .leftJoinAndSelect('tradeHistory.lot', 'lot')
      .leftJoinAndSelect('tradeHistory.seller', 'seller')
      .leftJoinAndSelect('tradeHistory.buyer', 'buyer')
      .select([
        'tradeHistory.id',
        'tradeHistory.createdAt',
        'lot.id',
        'lot.price',
      ])
      .where('tradeHistory.createdAt BETWEEN :from AND :to', {
        from,
        to,
      })
      .orderBy('tradeHistory.createdAt', 'DESC')

    queryBuilder.andWhere(
      'tradeHistory.seller.id = :userId OR tradeHistory.buyer.id = :userId',
      { userId },
    )

    return queryBuilder.getMany()
  }
}
