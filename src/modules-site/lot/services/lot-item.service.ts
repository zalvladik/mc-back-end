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
import { getVipParams } from 'src/shared/helpers/getVipParams'
import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import { TradeHistory } from 'src/entities/trade-history.entity'
import type { ByeLotItemServiceT, CreateLotItemServiceT } from '../types'
import type {
  ByeLotItemResponseDto,
  CreateLotResponseDto,
} from '../dtos-response'

@Injectable()
export class LotItemService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(TradeHistory)
    private readonly tradeHistoryRepository: Repository<TradeHistory>,
    private readonly mcFetchingService: McFetchingService,
  ) {}

  async createLotItem({
    userId,
    itemId,
    price,
    username,
    vip,
  }: CreateLotItemServiceT): Promise<CreateLotResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (price > 64 * 27 * 9)
      throw new BadRequestException(
        `Надто велика ціна, максимальна - ${64 * 27 * 9}`,
      )

    const itemForLot = await this.itemRepository.findOne({
      where: { id: itemId, user: { id: userId } },
      relations: ['lot'],
    })

    if (!itemForLot) throw new NotFoundException('Предмет не знайдено')

    if (itemForLot.lot && itemForLot.lot.isSold) {
      throw new ConflictException('Для цього предмет уже виставлений лот')
    }

    const currentLotCount = await this.lotRepository.count({
      where: { user, isSold: false },
    })

    const { vipLotCount } = getVipParams(vip)

    if (currentLotCount + 1 > vipLotCount) {
      throw new BadRequestException(
        `У вас перевищена кількість лотів, максимально ${vipLotCount} шт.`,
      )
    }

    const newLot = this.lotRepository.create({
      user,
      price,
      item: itemForLot,
    })

    itemForLot.lot = newLot

    await this.lotRepository.save(newLot)
    await this.itemRepository.save(itemForLot)

    const { serialized, lot, ...rest } = itemForLot

    return { id: newLot.id, price, item: { ...rest }, username }
  }

  async buyLotItem({
    lotId,
    vip,
    buyerUserId,
  }: ByeLotItemServiceT): Promise<ByeLotItemResponseDto> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId, isSold: false },
      relations: ['item', 'item.user'],
    })

    if (!lotMetaData) throw new NotFoundException('Лот не знайдено')

    const buyerUser = await this.userRepository.findOne({
      where: { id: buyerUserId },
    })

    if (!buyerUser) {
      throw new NotFoundException('Покупця з таким ніком не існує')
    }

    if (Number(lotMetaData.price) > Number(buyerUser.money)) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    const currentItemsCount = await this.itemRepository.count({
      where: { user: { id: buyerUserId }, isTaken: false },
    })

    const { vipItemCount } = getVipParams(vip)

    if (currentItemsCount + 1 > vipItemCount) {
      throw new BadRequestException(
        `У вас мало місця в інвентарі, максимально ${vipItemCount} предметів.`,
      )
    }

    const lotItem = lotMetaData.item

    lotItem.lot = null

    const sellerUser = lotItem.user

    buyerUser.money = +buyerUser.money - +lotMetaData.price

    sellerUser.money = +sellerUser.money + +lotMetaData.price

    const updatedItem = { ...lotItem, user: buyerUser }

    await this.userRepository.save(buyerUser)
    await this.userRepository.save(sellerUser)

    await this.itemRepository.save(updatedItem)

    const newTradeHistory = await this.tradeHistoryRepository.create({
      seller: sellerUser,
      buyer: buyerUser,
      lot: lotMetaData,
      createdAt: new Date(),
    })

    await this.tradeHistoryRepository.save(newTradeHistory)

    await this.lotRepository.update({ id: lotId }, { isSold: true })

    this.mcFetchingService.byeItemLotNotification({
      username: sellerUser.username,
      serialized: lotMetaData.item.serialized,
      message: ` §b+${lotMetaData.price}⟡ §f| §7Купили лот: §a${lotMetaData.item.display_name}`,
    })

    const { user, serialized, ...rest } = lotMetaData.item

    return rest
  }
}
