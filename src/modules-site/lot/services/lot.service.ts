import {
  BadRequestException,
  Injectable,
  Logger,
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
  GetItemWithEnchantsService,
  GetLotsSerivce,
  GetShulkerLotsService,
} from '../types'

@Injectable()
export class LotService {
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

  private logger = new Logger('LotService')

  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async getEnchantItems({
    page = 1,
    limit = 8,
    enchants,
    itemType,
    username,
    enchantType,
    didNeedUserLots = false,
    didNeedShulkers = false,
    didPriceToUp = true,
    didNeedIdentical = false,
  }: GetItemWithEnchantsService): Promise<GetLotsResponseDto> {
    const enchantMetaType = getEnchantMetaType(enchantType)

    if (!enchantMetaType) {
      throw new BadRequestException(
        'Хибний тип для пошуку зачарованих предметів',
      )
    }

    let select = this.selectLote

    if (didNeedShulkers) {
      select = [...select, ...this.selectShulker]
    }

    const queryBuilder = this.lotRepository.createQueryBuilder('lot')

    if (didNeedShulkers) {
      queryBuilder
        .leftJoinAndSelect('lot.item', 'item')
        .leftJoinAndSelect('item.enchantMeta', 'itemEnchantMeta')
        .leftJoinAndSelect('lot.shulker', 'shulker')
        .leftJoinAndSelect('shulker.items', 'shulkerItem')
        .leftJoinAndSelect('shulkerItem.enchantMeta', 'shulkerItemEnchantMeta')
    } else {
      queryBuilder
        .innerJoinAndSelect('lot.item', 'item')
        .leftJoinAndSelect('item.enchantMeta', 'itemEnchantMeta')
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)

    if (didNeedUserLots === false) {
      queryBuilder.andWhere('lot.username != :username', { username })
    }

    const enchantsArray = enchants.split(',')

    const sqlLengthEnchants = didNeedShulkers
      ? `(LENGTH(itemEnchantMeta.${enchantMetaType}) = ${enchantsArray.length} OR LENGTH(shulkerItemEnchantMeta.${enchantMetaType}) = ${enchantsArray.length})`
      : `LENGTH(itemEnchantMeta.${enchantMetaType}) = ${enchantsArray.length}`

    const sqlEnchants = didNeedShulkers
      ? `(FIND_IN_SET(:enchants, itemEnchantMeta.${enchantMetaType}) > 0 OR FIND_IN_SET(:enchants, shulkerItemEnchantMeta.${enchantMetaType}) > 0)`
      : `(FIND_IN_SET(:enchants, itemEnchantMeta.${enchantMetaType}) > 0)`

    const sqlEnchantType = didNeedShulkers
      ? `(itemEnchantMeta.enchantType = :enchantType OR shulkerItemEnchantMeta.enchantType = :enchantType)`
      : `(itemEnchantMeta.enchantType = :enchantType)`

    const sqlType = didNeedShulkers
      ? '(item.type LIKE :itemType OR shulkerItem.type LIKE :itemType)'
      : '(item.type LIKE :itemType)'

    queryBuilder.andWhere(sqlEnchantType, {
      enchantType,
    })

    queryBuilder.andWhere(sqlType, {
      itemType,
    })

    if (didNeedIdentical) {
      queryBuilder.andWhere(sqlLengthEnchants)
    }

    for (let i = 0; i < enchantsArray.length; i++) {
      queryBuilder.andWhere(sqlEnchants, { enchants: enchantsArray[i] })
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

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
    username,
    didNeedUserLots,
    didPriceToUp,
  }: GetShulkerLotsService): Promise<GetLotsResponseDto> {
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

    if (didNeedUserLots === false) {
      queryBuilder.andWhere('lot.username != :username', { username })
    }

    if (display_nameOrType) {
      queryBuilder.andWhere(
        '(shulkerItem.display_name LIKE :display_nameOrType OR shulkerItem.type LIKE :display_nameOrType)',
        {
          display_nameOrType: `%${display_nameOrType}%`,
        },
      )
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

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
    username,
    didPriceToUp,
    didNeedUserLots,
    didNeedShulkers,
  }: GetLotsSerivce): Promise<GetLotsResponseDto> {
    let select = this.selectLote

    if (didNeedShulkers) {
      select = [...select, ...this.selectShulker]
    }

    const queryBuilder = this.lotRepository.createQueryBuilder('lot')

    if (didNeedShulkers) {
      queryBuilder
        .leftJoinAndSelect('lot.item', 'item')
        .leftJoinAndSelect('lot.shulker', 'shulker')
        .leftJoinAndSelect('shulker.items', 'shulkerItem')
    } else {
      queryBuilder.innerJoinAndSelect('lot.item', 'item')
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)

    if (didNeedUserLots === false) {
      queryBuilder.andWhere('lot.username != :username', { username })
    }

    if (category) {
      const sqlCategory = didNeedShulkers
        ? '(FIND_IN_SET(:category, item.categories) OR FIND_IN_SET(:category, shulkerItem.categories))'
        : '(FIND_IN_SET(:category, item.categories)'

      queryBuilder.andWhere(sqlCategory, { category })
    }

    if (display_nameOrType) {
      const sqlDisplay_nameOrType = didNeedShulkers
        ? '(item.display_name LIKE :display_nameOrType OR item.type LIKE :display_nameOrType OR shulkerItem.display_name LIKE :display_nameOrType OR shulkerItem.type LIKE :display_nameOrType)'
        : '(item.display_name LIKE :display_nameOrType OR item.type LIKE :display_nameOrType)'

      queryBuilder.andWhere(sqlDisplay_nameOrType, {
        display_nameOrType: `%${display_nameOrType}%`,
      })
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

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
      .select([...this.selectLote, ...this.selectShulker])
      .getMany()
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
