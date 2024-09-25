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

import { Lot } from 'src/entities/lot.entity'

import { User } from 'src/entities/user.entity'
import { Shulker } from 'src/entities/shulker.entity'
import { getVipParams } from 'src/shared/helpers/getVipParams'
import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import { TradeHistory } from 'src/entities/trade-history.entity'
import type { ByeLotShulkerServiceT, CreateLotShulkerServiceT } from '../types'
import type {
  BuyLotShulkerResponseDto,
  CreateLotResponseDto,
} from '../dtos-response'

@Injectable()
export class LotShulkerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Shulker)
    private readonly shulkerRepository: Repository<Shulker>,
    @InjectRepository(TradeHistory)
    private readonly tradeHistoryRepository: Repository<TradeHistory>,
    private readonly mcFetchingService: McFetchingService,
  ) {}

  async createLotShulker({
    userId,
    shulkerId,
    price,
    username,
    vip,
  }: CreateLotShulkerServiceT): Promise<CreateLotResponseDto> {
    if (price > 64 * 27 * 9)
      throw new BadRequestException(
        `Надто велика ціна, максимальна - ${64 * 27 * 9}`,
      )

    const shulkerForLot = await this.shulkerRepository.findOne({
      where: { id: shulkerId, user: { id: userId } },
      relations: ['lot'],
    })

    if (!shulkerForLot) throw new NotFoundException('Шалкер не знайдено')

    if (shulkerForLot.lot && shulkerForLot.lot.isSold) {
      throw new ConflictException('Для цього шалкера уже виставлений лот')
    }

    const { vipLotCount } = getVipParams(vip)

    const currentLotCount = await this.lotRepository.count({
      where: { username, isSold: false },
    })

    if (currentLotCount + 1 > vipLotCount) {
      throw new BadRequestException(
        `У вас перевищена кількість лотів, максимально ${vipLotCount} шт.`,
      )
    }

    const newLot = this.lotRepository.create({
      username,
      price,
      shulker: shulkerForLot,
    })

    shulkerForLot.lot = newLot

    await this.lotRepository.save(newLot)
    await this.shulkerRepository.save(shulkerForLot)

    const { lot, ...rest } = shulkerForLot

    return { id: newLot.id, price, shulker: { ...rest }, username }
  }

  async buyLotShulker({
    lotId,
    vip,
    buyerUserId,
  }: ByeLotShulkerServiceT): Promise<BuyLotShulkerResponseDto> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId },
      relations: ['shulker', 'shulker.user', 'shulker.items'],
    })

    if (!lotMetaData) throw new NotFoundException('Лот не знайдено')

    const buyerUser = await this.userRepository.findOne({
      where: { id: buyerUserId },
    })

    if (lotMetaData.price > buyerUser.money) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    const currentShulkersCount = await this.shulkerRepository.count({
      where: { user: { id: buyerUserId }, isTaken: false },
    })

    const { vipShulkerCount } = getVipParams(vip)

    if (currentShulkersCount + 1 > vipShulkerCount) {
      throw new BadRequestException(
        `У вас максимальна кількість шалкерів, максимально ${vipShulkerCount} шлк.`,
      )
    }

    const lotShulker = lotMetaData.shulker

    lotShulker.lot = null

    const sellerUser = lotShulker.user

    buyerUser.money -= lotMetaData.price
    sellerUser.money += lotMetaData.price

    const updatedShulker = {
      ...lotShulker,
      user: buyerUser,
      username: buyerUser.username,
    }

    await this.userRepository.save(buyerUser)
    await this.userRepository.save(sellerUser)

    await this.shulkerRepository.save(updatedShulker)

    const newTradeHistory = await this.tradeHistoryRepository.create({
      seller: sellerUser,
      buyer: buyerUser,
      lot: lotMetaData,
      createdAt: new Date(),
    })

    await this.tradeHistoryRepository.save(newTradeHistory)

    await this.lotRepository.update({ id: lotId }, { isSold: true })

    this.mcFetchingService.byeShulkerLotNotification({
      username: sellerUser.username,
      serializedArray: lotMetaData.shulker.items.map(item => item.serialized),
      message: ` §b+${lotMetaData.price}⟡ §f| §7Купили лот: §aшалкер`,
    })

    const { user, items, ...rest } = lotMetaData.shulker

    return rest
  }
}
