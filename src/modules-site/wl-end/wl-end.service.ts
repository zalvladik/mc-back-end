import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import { WL_END_COST } from 'src/shared/constants'

@Injectable()
export class WlEndService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async byeWlEndTicket(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['money', 'id'],
    })

    if (user.money < WL_END_COST) {
      throw new HttpException('Недостатньо ДР', HttpStatus.PAYMENT_REQUIRED)
    }

    user.money -= WL_END_COST

    await this.userRepository.save(user)
  }
}
