import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserInventory } from 'src/entities/user-inventory.entity'

import type {
  AddMoneyToUserInventoryResponseDto,
  GetMoneyToUserInventoryResponseDto,
} from '../dtos-responses'

@Injectable()
export class UserInventoryMoneyService {
  constructor(
    @InjectRepository(UserInventory)
    private readonly userInventoryRepository: Repository<UserInventory>,
  ) {}

  async getMoneyById(id: number): Promise<{ money: number }> {
    return this.userInventoryRepository.findOne({
      where: { id },
      select: ['money'],
    })
  }

  async getMoneyByRealname(realname: string): Promise<{ money: number }> {
    return this.userInventoryRepository.findOne({
      where: { realname },
      select: ['money'],
    })
  }

  async addMoneyToInventory(
    moneyToAdd: number,
    realname: string,
  ): Promise<AddMoneyToUserInventoryResponseDto> {
    const { money: moneyBefore } = await this.getMoneyByRealname(realname)

    await this.userInventoryRepository.increment(
      { realname },
      'money',
      moneyToAdd,
    )

    return { moneyBefore, moneyAfter: moneyBefore + moneyToAdd }
  }

  async removeMoneyFromInventory(
    moneyToRemove: number,
    realname: string,
  ): Promise<GetMoneyToUserInventoryResponseDto> {
    const { money: moneyBefore } = await this.getMoneyByRealname(realname)

    if (moneyBefore < moneyToRemove) {
      throw new HttpException('Not enough money', HttpStatus.PAYMENT_REQUIRED)
    }

    await this.userInventoryRepository.decrement(
      { realname },
      'money',
      moneyToRemove,
    )

    return { moneyBefore, moneyAfter: moneyBefore - moneyToRemove }
  }
}
