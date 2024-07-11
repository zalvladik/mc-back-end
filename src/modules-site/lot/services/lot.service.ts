import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Lot } from 'src/entities/lot.entity'

import { getEnchantMetaType } from 'src/shared/helpers/getEnchantMetaType'
import type {
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'
import type {
  GetItemWithEnchantsQuaryDto,
  GetLotsQuaryDto,
  GetShulkerLotsQuaryDto,
} from '../dtos-request'

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async getItemWithEnchants({
    page = 1,
    limit = 8,
    enchants,
    type,
    enchantType,
  }: GetItemWithEnchantsQuaryDto): Promise<GetLotsResponseDto> {
    const enchantMetaType = getEnchantMetaType(enchantType)

    if (!enchantMetaType) {
      throw new BadRequestException(
        'Хибний тип для пошуку зачарованих предметів',
      )
    }

    const queryBuilder = this.lotRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.item.enchantMeta', 'itemEnchantMeta')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .leftJoinAndSelect('shulker.items', 'shulkerItem')
      .leftJoinAndSelect('shulker.items.enchantMeta', 'shulkerItemEnchantMeta')
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
        'shulker.categories',
        'shulker.type',
        'shulker.display_name',
      ])

    const enchantsString = enchants.join(',')

    queryBuilder.andWhere(
      `(FIND_IN_SET(itemEnchantMeta.${enchantMetaType}, :enchantsString)) > 0`,
      { enchantsString },
    )

    queryBuilder.andWhere(
      '(itemEnchantMeta.enchantType LIKE :enchantType OR itemEnchantMeta.enchantType LIKE :enchantType)',
      {
        enchantType: `%${enchantType}%`,
      },
    )

    queryBuilder.andWhere(
      '(item.type LIKE :type OR shulkerItem.type LIKE :type)',
      {
        type: `%${type}%`,
      },
    )

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots,
    }
  }

  async getShulkerLots({
    page = 1,
    limit = 8,
    display_nameOrType,
  }: GetShulkerLotsQuaryDto): Promise<GetLotsResponseDto> {
    const queryBuilder = this.lotRepository
      .createQueryBuilder('lot')
      .innerJoinAndSelect('lot.shulker', 'shulker')
      .innerJoinAndSelect('shulker.items', 'shulkerItem')
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'lot',
        'shulker.id',
        'shulker.username',
        'shulker.categories',
        'shulker.type',
        'shulker.display_name',
      ])

    if (display_nameOrType) {
      queryBuilder.andWhere(
        '(shulkerItem.display_name LIKE :display_nameOrType OR shulkerItem.type LIKE :display_nameOrType)',
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
        'shulker.categories',
        'shulker.type',
        'shulker.display_name',
      ])

    if (category) {
      queryBuilder.andWhere(
        '(FIND_IN_SET(:category, item.categories) OR FIND_IN_SET(:category, shulkerItem.categories))',
        { category },
      )
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

  async getUserLots(username: string): Promise<Lot[]> {
    return this.lotRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .where('lot.username = :username', { username })
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
        'shulker.categories',
        'shulker.type',
        'shulker.display_name',
      ])
      .getMany()
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
