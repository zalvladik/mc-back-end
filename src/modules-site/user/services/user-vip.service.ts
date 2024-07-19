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

  async byeVip({ vip, id }: ByeVipProps): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['money', 'vip'],
    })

    if (user.vip) {
      throw new BadRequestException('У вас уже куплено VIP')
    }

    if (user.money < vipPrice[vip]) {
      throw new BadRequestException('У вас недостатньо коштів')
    }

    const currentDate = new Date()
    const expirationDate = new Date()
    expirationDate.setDate(currentDate.getDate() + 7)
    expirationDate.setHours(0, 0, 0, 0)

    await this.userRepository.update(id, {
      vip,
      money: user.money - vipPrice[vip],
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
