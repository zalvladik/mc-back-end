import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { Lot } from 'src/entities/lot.entity'

import { User } from 'src/entities/user.entity'
import type { ByeLotServiceT, CreateLotServiceT } from '../types'
import type {
  CreateLotItemResponseDto,
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'
import type { GetLotsQuaryDto } from '../dtos-request'

@Injectable()
export class LotItemService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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
      ])
      .getMany()
  }

  async createLot({
    userId,
    itemId,
    price,
    username,
    countLot,
  }: CreateLotServiceT): Promise<CreateLotItemResponseDto> {
    if (price > 64 * 27 * 9)
      throw new BadRequestException(
        `Надто велика ціна, максимальна - ${64 * 27 * 9}`,
      )

    const itemForLot = await this.itemRepository.findOne({
      where: { id: itemId, user: { id: userId } },
      relations: ['lot'],
    })

    if (!itemForLot) throw new NotFoundException('Предмет не знайдено')

    if (itemForLot.lot) {
      throw new ConflictException('Для цього предмет уже виставлений лот')
    }

    const currentLotCount = await this.lotRepository.count({
      where: { username },
    })

    if (currentLotCount + 1 > countLot) {
      throw new BadRequestException(
        `У вас перевищена кількість лотів, максимально ${countLot} шт.`,
      )
    }

    const newLot = this.lotRepository.create({
      username,
      price,
      item: itemForLot,
    })

    itemForLot.lot = newLot

    await this.lotRepository.save(newLot)
    await this.itemRepository.save(itemForLot)

    const { serialized, lot, ...rest } = itemForLot

    return { id: newLot.id, price, item: { ...rest }, username }
  }

  async buyLot({
    lotId,
    shulkerCount,
    buyerUserId,
  }: ByeLotServiceT): Promise<Item> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId },
      relations: ['item', 'item.user'],
    })

    if (!lotMetaData) throw new NotFoundException('Лот не знайдено')

    const buyerUser = await this.userRepository.findOne({
      where: { id: buyerUserId },
    })

    if (!buyerUser) {
      throw new NotFoundException('Покупця з таким ніком не існує')
    }

    if (lotMetaData.price > buyerUser.money) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    const currentItemsCount = await this.itemRepository.count({
      where: { user: { id: buyerUserId } },
    })

    if (currentItemsCount + 1 > shulkerCount * 27) {
      throw new BadRequestException(
        `У вас мало місця в інвентарі, максимально ${shulkerCount} шлк.`,
      )
    }

    const sellerUser = lotMetaData.item.user

    buyerUser.money -= lotMetaData.price
    sellerUser.money += lotMetaData.price

    const updatedItem = { ...lotMetaData.item, user: buyerUser }

    await this.userRepository.save(buyerUser)
    await this.userRepository.save(sellerUser)

    await this.itemRepository.save(updatedItem)
    await this.deleteLot(lotId)

    return updatedItem
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
