import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import { WL_END_COST } from 'src/shared/constants'
import { WlEnd } from 'src/entities/wl-end.entity'

@Injectable()
export class WlEndService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WlEnd)
    private readonly wlEndRepository: Repository<WlEnd>,
  ) {}

  async wlEndList(): Promise<WlEnd[]> {
    return this.wlEndRepository.find()
  }

  async byeWlEndTicket(id: number, username: string): Promise<void> {
    const isExistPlayerInWlEnd = await this.wlEndRepository.findOne({
      where: { username },
    })

    if (isExistPlayerInWlEnd) {
      throw new ConflictException('Допуск до енду вже оплачений')
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['money', 'id'],
    })

    if (user.money < WL_END_COST) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    user.money -= WL_END_COST

    const newPlayerInWlEnd = this.wlEndRepository.create({ username })

    await this.userRepository.save(user)
    await this.wlEndRepository.save(newPlayerInWlEnd)
  }
}
