import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { vipPrice } from 'src/shared/constants'
import { getKievTime } from 'src/shared/helpers/getKievTime'
import type { ByeVipProps, UpgradeVipProps } from '../types'

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

    const expirationDate = getKievTime()
    expirationDate.setDate(expirationDate.getDate() + 7)

    await this.userRepository.update(id, {
      vip,
      money: user.money - vipPrice[vip],
      vipExpirationDate: expirationDate,
    })
  }

  async upgradeVip({ vip, id }: UpgradeVipProps): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['money', 'vip', 'vipExpirationDate'],
    })

    if (!user.vip) {
      throw new BadRequestException('У вас не куплено VIP')
    }

    if (vipPrice[vip] <= vipPrice[user.vip]) {
      throw new BadRequestException(
        'Ви можете придбати тільки той VIP, який краще вашого',
      )
    }

    if (user.money < vipPrice[vip]) {
      throw new BadRequestException('У вас недостатньо коштів')
    }

    const expirationDate = getKievTime()
    expirationDate.setDate(expirationDate.getDate() + 7)

    await this.userRepository.update(id, {
      vip,
      money: user.money - vipPrice[vip],
      vipExpirationDate: expirationDate,
    })
  }

  async checkUserVipExpression(): Promise<void> {
    const currentDate = new Date()
    currentDate.setHours(0, 1, 0, 0)

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ vip: null, vipExpirationDate: null })
      .where('vipExpirationDate <= :currentDate', { currentDate })
      .execute()
  }
}
