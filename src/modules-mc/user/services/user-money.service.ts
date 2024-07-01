import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'

import { SocketService } from 'src/shared/services/socket/socket.service'
import type {
  AddMoneyToUserResponseDto,
  GetMoneyToUserResponseDto,
} from '../dtos-responses'
import type { MoneyStorageDataT } from '../types'

@Injectable()
export class UserMoneyService {
  private moneyStorage = new Map<string, MoneyStorageDataT>()

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly socketService: SocketService,
  ) {}

  async getMoneyByUserName(username: string): Promise<{ money: number }> {
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
    const { money: moneyBefore } = await this.userRepository.findOne({
      where: { username },
      select: ['money'],
    })

    this.moneyStorage.set(moneyPostStorageId, {
      username,
      updatedMoney: moneyToAdd,
    })

    return { moneyBefore, moneyAfter: moneyBefore + moneyToAdd }
  }

  async addMoneyToUserConfirm(moneyPostStorageId: string): Promise<void> {
    const { username, updatedMoney } = this.moneyStorage.get(moneyPostStorageId)

    await this.userRepository.increment({ username }, 'money', updatedMoney)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: updatedMoney,
      type: 'incrementMoney',
    })
    this.moneyStorage.delete(moneyPostStorageId)
  }

  async removeMoneyFromUser(
    moneyToRemove: number,
    username: string,
    moneyStorageId: string,
  ): Promise<GetMoneyToUserResponseDto> {
    const { money: moneyBefore } = await this.userRepository.findOne({
      where: { username },
      select: ['money'],
    })

    if (moneyBefore < moneyToRemove) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    this.moneyStorage.set(moneyStorageId, {
      username,
      updatedMoney: moneyToRemove,
    })

    return { moneyBefore, moneyAfter: moneyBefore - moneyToRemove }
  }

  async removeMoneyFromUserConfirm(moneyStorageId: string): Promise<void> {
    const { username, updatedMoney } = this.moneyStorage.get(moneyStorageId)

    await this.userRepository.decrement({ username }, 'money', updatedMoney)
  }
}
