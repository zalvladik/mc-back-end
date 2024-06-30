import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'

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
  ): Promise<AddMoneyToUserResponseDto> {
    const { money: moneyBefore } = await this.getMoneyByUserName(username)

    await this.userRepository.increment({ username }, 'money', moneyToAdd)

    return { moneyBefore, moneyAfter: moneyBefore + moneyToAdd }
  }

  async removeMoneyFromUser(
    moneyToRemove: number,
    username: string,
    itemsStorageId: string,
  ): Promise<GetMoneyToUserResponseDto> {
    const { money: moneyBefore } = await this.getMoneyByUserName(username)

    if (moneyBefore < moneyToRemove) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    this.moneyStorage.set(itemsStorageId, { username, moneyToRemove })

    return { moneyBefore, moneyAfter: moneyBefore - moneyToRemove }
  }

  async removeMoneyFromUserConfirm(moneyStorageId: string): Promise<void> {
    const { username, moneyToRemove } = this.moneyStorage.get(moneyStorageId)

    await this.userRepository.decrement({ username }, 'money', moneyToRemove)
  }
}
