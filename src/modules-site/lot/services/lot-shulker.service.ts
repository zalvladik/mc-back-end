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
import type { ByeLotShulkerServiceT, CreateLotShulkerServiceT } from '../types'
import type {
  BuyLotShulkerResponseDto,
  CreateLotResponseDto,
  DeleteUserLotResponseDto,
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
  ) {}

  async createLotShulker({
    userId,
    shulkerId,
    price,
    username,
    lotCount,
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

    if (shulkerForLot.lot) {
      throw new ConflictException('Для цього шалкера уже виставлений лот')
    }

    const currentLotCount = await this.lotRepository.count({
      where: { username },
    })

    if (currentLotCount + 1 > lotCount) {
      throw new BadRequestException(
        `У вас перевищена кількість лотів, максимально ${lotCount} шт.`,
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
    shulkerCount,
    buyerUserId,
  }: ByeLotShulkerServiceT): Promise<BuyLotShulkerResponseDto> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId },
      relations: ['shulker', 'shulker.user'],
    })

    if (!lotMetaData) throw new NotFoundException('Лот не знайдено')

    const buyerUser = await this.userRepository.findOne({
      where: { id: buyerUserId },
    })

    if (lotMetaData.price > buyerUser.money) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    const currentShulkersCount = await this.shulkerRepository.count({
      where: { user: { id: buyerUserId } },
    })

    if (currentShulkersCount + 1 > shulkerCount) {
      throw new BadRequestException(
        `У вас максимальна кількість шалкерів, максимально ${shulkerCount} шлк.`,
      )
    }

    const sellerUser = lotMetaData.shulker.user

    buyerUser.money -= lotMetaData.price
    sellerUser.money += lotMetaData.price

    const updatedShulker = { ...lotMetaData.shulker, user: buyerUser }

    await this.userRepository.save(buyerUser)
    await this.userRepository.save(sellerUser)

    await this.shulkerRepository.save(updatedShulker)
    await this.deleteLot(lotId)

    const { user, ...rest } = lotMetaData.shulker

    return rest
  }

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
