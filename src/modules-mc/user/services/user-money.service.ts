import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'

import { SocketService } from 'src/shared/services/socket/socket.service'
import { SocketTypes } from 'src/shared/constants'
import { CacheService } from 'src/shared/services/cache'
import type {
  AddMoneyToUserResponseDto,
  GetMoneyToUserResponseDto,
} from '../dtos-responses'
import type { MoneyStorageDataT } from '../types'

@Injectable()
export class UserMoneyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly socketService: SocketService,
    private readonly cacheService: CacheService,
  ) {}

  async getMoneyByUserName(username: string): Promise<{ money: number }> {
    const user = await this.userRepository.findOne({
      where: { username, isTwink: true },
    })

    if (user) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    return this.userRepository.findOne({
      where: { username },
      select: ['money'],
    })
  }

  async addMoneyToUser(
    moneyToAdd: number,
    username: string,
    moneyPostStorageId: string,
  ): Promise<AddMoneyToUserResponseDto> {
    const { money: moneyBefore, isTwink } = await this.userRepository.findOne({
      where: { username },
      select: ['money', 'isTwink'],
    })

    if (isTwink) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    this.cacheService.set(moneyPostStorageId, {
      username,
      updatedMoney: moneyToAdd,
    })

    return { moneyBefore, moneyAfter: moneyBefore + moneyToAdd }
  }

  async addMoneyToUserConfirm(moneyPostStorageId: string): Promise<void> {
    const { username, updatedMoney } =
      this.cacheService.get<MoneyStorageDataT>(moneyPostStorageId)

    await this.userRepository.increment({ username }, 'money', updatedMoney)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: updatedMoney,
      type: SocketTypes.INCREMENT_MONEY,
    })
    this.cacheService.delete(moneyPostStorageId)
  }

  async removeMoneyFromUser(
    moneyToRemove: number,
    username: string,
    cacheId: string,
  ): Promise<GetMoneyToUserResponseDto> {
    const { money: moneyBefore, isTwink } = await this.userRepository.findOne({
      where: { username },
      select: ['money', 'isTwink'],
    })

    if (isTwink) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    if (moneyBefore < moneyToRemove) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    this.cacheService.set(cacheId, {
      username,
      updatedMoney: moneyToRemove,
    })

    return { moneyBefore, moneyAfter: moneyBefore - moneyToRemove }
  }

  async removeMoneyFromUserConfirm(moneyStorageId: string): Promise<void> {
    const { username, updatedMoney } =
      this.cacheService.get<MoneyStorageDataT>(moneyStorageId)

    await this.userRepository.decrement({ username }, 'money', updatedMoney)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: updatedMoney,
      type: SocketTypes.DECREMENT_MONEY,
    })
  }
}
