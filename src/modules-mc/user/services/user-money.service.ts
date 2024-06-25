import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'

import type {
  AddMoneyToUserResponseDto,
  GetMoneyToUserResponseDto,
} from '../dtos-responses'

@Injectable()
export class UserMoneyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMoneyByUserName(username: string): Promise<{ money: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return this.userRepository.findOne({
      where: { username },
      select: ['money'],
    })
  }

  async addMoneyToUser(
    moneyToAdd: number,
    username: string,
  ): Promise<AddMoneyToUserResponseDto> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { money: moneyBefore } = await this.getMoneyByUserName(username)

    await this.userRepository.increment({ username }, 'money', moneyToAdd)

    return { moneyBefore, moneyAfter: moneyBefore + moneyToAdd }
  }

  async removeMoneyFromUser(
    moneyToRemove: number,
    username: string,
  ): Promise<GetMoneyToUserResponseDto> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { money: moneyBefore } = await this.getMoneyByUserName(username)

    if (moneyBefore < moneyToRemove) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    await this.userRepository.decrement({ username }, 'money', moneyToRemove)

    return { moneyBefore, moneyAfter: moneyBefore - moneyToRemove }
  }
}
