import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { vipPrice } from 'src/shared/constants'
import type { ByeVipProps } from '../types'

@Injectable()
export class UserVipService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async byeVip({ vip, money, id }: ByeVipProps): Promise<any> {
    if (money < vipPrice[vip]) {
      throw new BadRequestException('У вас недостатньо коштів')
    }

    const currentDate = new Date()
    const expirationDate = new Date()
    expirationDate.setDate(currentDate.getDate() + 6)
    expirationDate.setHours(23, 50, 0, 0)

    await this.userRepository.update(id, {
      vip,
      money: money - vipPrice[vip],
      vipExpirationDate: expirationDate,
    })
  }

  async checkUserVipExpression(): Promise<void> {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ vip: null, vipExpirationDate: null })
      .where('vipExpirationDate <= :currentDate', { currentDate })
      .execute()
  }
}
