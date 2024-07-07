import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Lot } from 'src/entities/lot.entity'

import type {
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'
import type { GetLotsQuaryDto } from '../dtos-request'

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async getLots({
    page = 1,
    limit = 8,
    category,
    display_nameOrType,
  }: GetLotsQuaryDto): Promise<GetLotsResponseDto> {
    const queryBuilder = this.lotRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .leftJoinAndSelect('shulker.items', 'shulkerItem')
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'lot',
        'item.id',
        'item.amount',
        'item.type',
        'item.display_name',
        'item.description',
        'item.enchants',
        'item.categories',
        'item.durability',
        'shulker.id',
        'shulker.username',
        'shulker.type',
        'shulker.display_name',
        'shulkerItem.id',
        'shulkerItem.amount',
        'shulkerItem.type',
        'shulkerItem.display_name',
      ])

    if (category) {
      queryBuilder.andWhere('FIND_IN_SET(:category, item.categories)', {
        category,
      })
    }

    if (display_nameOrType) {
      queryBuilder.andWhere(
        '(item.display_name LIKE :display_nameOrType OR item.type LIKE :display_nameOrType OR shulkerItem.display_name LIKE :display_nameOrType OR shulkerItem.type LIKE :display_nameOrType)',
        {
          display_nameOrType: `%${display_nameOrType}%`,
        },
      )
    }

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots,
    }
  }

  async getUserLots(userId: number): Promise<Lot[]> {
    return this.lotRepository
      .createQueryBuilder('lot')
      .innerJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .leftJoinAndSelect('shulker.items', 'shulkerItem')
      .where('item.user.id = :userId', { userId })
      .select([
        'lot',
        'item.id',
        'item.amount',
        'item.type',
        'item.display_name',
        'item.description',
        'item.enchants',
        'item.categories',
        'item.durability',
        'shulker.id',
        'shulker.username',
        'shulker.type',
        'shulker.display_name',
        'shulkerItem.id',
        'shulkerItem.amount',
        'shulkerItem.type',
        'shulkerItem.display_name',
      ])
      .getMany()
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
