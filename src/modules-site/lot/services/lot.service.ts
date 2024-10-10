import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Lot } from 'src/entities/lot.entity'

import { getEnchantMetaType } from 'src/shared/helpers/getEnchantMetaType'
import { Item } from 'src/entities/item.entity'
import { Shulker } from 'src/entities/shulker.entity'
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

  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Shulker)
    private readonly shulkerRepository: Repository<Shulker>,
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
      .andWhere('lot.isSold = :isSold', { isSold: false })
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)

    if (didNeedUserLots === false) {
      queryBuilder.andWhere('lot.username != :username', { username })
    }

    const enchantsArray = enchants.split(',')

    const sqlLengthEnchants = didNeedShulkers
      ? `(itemEnchantMeta.enchantLength = ${enchantsArray.length} OR shulkerItemEnchantMeta.enchantLength = ${enchantsArray.length})`
      : `itemEnchantMeta.enchantLength = ${enchantsArray.length}`

    const sqlEnchantType = didNeedShulkers
      ? `(itemEnchantMeta.enchantType = :enchantType OR shulkerItemEnchantMeta.enchantType = :enchantType)`
      : `(itemEnchantMeta.enchantType = :enchantType)`

    const sqlType = didNeedShulkers
      ? '(item.type = :itemType OR shulkerItem.type = :itemType)'
      : '(item.type = :itemType)'

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
      const paramName = `enchants${i}`
      const paramValue = enchantsArray[i]

      const sqlEnchants = didNeedShulkers
        ? `(FIND_IN_SET(:${paramName}, itemEnchantMeta.${enchantMetaType}) > 0 OR FIND_IN_SET(:${paramName}, shulkerItemEnchantMeta.${enchantMetaType}) > 0)`
        : `(FIND_IN_SET(:${paramName}, itemEnchantMeta.${enchantMetaType}) > 0)`

      queryBuilder.andWhere(sqlEnchants, { [paramName]: paramValue })
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots: lots.map(item => {
        const { user, ...rest } = item

        return { ...rest, username: user.username }
      }),
    }
  }

  async getShulkerLots({
    page = 1,
    limit = 8,
    display_nameOrType,
    username,
    didNeedUserLots,
    didPriceToUp,
    didNeedIdentical,
  }: GetShulkerLotsService): Promise<GetLotsResponseDto> {
    const queryBuilder = this.lotRepository
      .createQueryBuilder('lot')
      .innerJoinAndSelect('lot.shulker', 'shulker')
      .innerJoinAndSelect('shulker.items', 'shulkerItem')
      .andWhere('lot.isSold = :isSold', { isSold: false })
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

    const isLike = didNeedIdentical ? '=' : 'LIKE'

    if (display_nameOrType) {
      const searchTerm = didNeedIdentical
        ? display_nameOrType.toLowerCase()
        : `%${display_nameOrType.toLowerCase()}%`

      queryBuilder.andWhere(
        `(LOWER(shulkerItem.display_name) ${isLike} :display_nameOrType OR LOWER(shulkerItem.type) ${isLike} :display_nameOrType)`,
        {
          display_nameOrType: searchTerm,
        },
      )
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots: lots.map(item => {
        const { user, ...rest } = item

        return { ...rest, username: user.username }
      }),
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
    didNeedIdentical,
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
      .andWhere('lot.isSold = :isSold', { isSold: false })
      .skip((page - 1) * limit)
      .take(limit)
      .select(select)

    if (didNeedUserLots === false) {
      queryBuilder.andWhere('lot.username != :username', { username })
    }

    if (category) {
      const sqlCategory = didNeedShulkers
        ? '(FIND_IN_SET(:category, item.categories) OR FIND_IN_SET(:category, shulkerItem.categories))'
        : 'FIND_IN_SET(:category, item.categories)'

      queryBuilder.andWhere(sqlCategory, { category })
    }

    const isLike = didNeedIdentical ? '=' : 'LIKE'

    if (display_nameOrType) {
      const searchTerm = didNeedIdentical
        ? display_nameOrType.toLowerCase()
        : `%${display_nameOrType.toLowerCase()}%`

      const sqlDisplay_nameOrType = didNeedShulkers
        ? `(LOWER(item.display_name) ${isLike} :display_nameOrType OR LOWER(item.type) ${isLike} :display_nameOrType OR LOWER(shulkerItem.display_name) ${isLike} :display_nameOrType OR LOWER(shulkerItem.type) ${isLike} :display_nameOrType)`
        : `(LOWER(item.display_name) ${isLike} :display_nameOrType OR LOWER(item.type) ${isLike} :display_nameOrType)`

      queryBuilder.andWhere(sqlDisplay_nameOrType, {
        display_nameOrType: searchTerm,
      })
    }

    const orderDirection = didPriceToUp ? 'ASC' : 'DESC'
    queryBuilder.orderBy('lot.price', orderDirection)

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots: lots.map(item => {
        const { user, ...rest } = item

        return { ...rest, username: user.username }
      }),
    }
  }

  async getUserLots(username: string): Promise<Lot[]> {
    return this.lotRepository
      .createQueryBuilder('lot')
      .leftJoinAndSelect('lot.item', 'item')
      .leftJoinAndSelect('lot.shulker', 'shulker')
      .andWhere('lot.isSold = :isSold', { isSold: false })
      .andWhere('lot.username = :username', { username })
      .select([...this.selectLote, ...this.selectShulker])
      .getMany()
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const lotItem = await this.lotRepository.findOne({
      where: { id },
      relations: ['shulker', 'item'],
    })

    if (!lotItem) {
      throw new NotFoundException('Lot not found or already sold')
    }

    if (lotItem.shulker) {
      await this.shulkerRepository.update(lotItem.shulker.id, { lot: null })
    }

    if (lotItem.item) {
      await this.itemRepository.update(lotItem.item.id, { lot: null })
    }

    await this.lotRepository.delete({ id, isSold: false })

    return { id }
  }
}
