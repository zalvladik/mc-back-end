import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { TWINKS_COUNT, TWINKS_PRICE } from 'src/shared/constants'
import { Repository } from 'typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import type { CreateTwinksService } from '../types'

@Injectable()
export class TwinkService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: Repository<User>,
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async getTwinks(mainUserName: string): Promise<any> {
    return this.userRepositry.find({ where: { mainUserName } })
  }

  async createTwinks({
    userId,
    mainUserName,
    twinkName,
  }: CreateTwinksService): Promise<void> {
    const [isUserNameTwinkInWl, isUserNameTwinkInUsers] = await Promise.all([
      this.whitelistRepository.findOne({ where: { username: twinkName } }),
      this.userRepositry.findOne({ where: { username: twinkName } }),
    ])

    if (isUserNameTwinkInWl || isUserNameTwinkInUsers) {
      throw new ConflictException('Цей нікНейм зайнятий')
    }

    const countTwinks = await this.whitelistRepository.count({
      where: { mainUserName, isTwink: true },
    })

    if (countTwinks >= TWINKS_COUNT) {
      throw new BadRequestException(
        `У вас перевищена кількість твінів, максимально ${TWINKS_COUNT} шт.`,
      )
    }

    const currentUser = await this.userRepositry.findOne({
      where: { id: userId },
    })

    const currentUserInWl = await this.whitelistRepository.findOne({
      where: { username: mainUserName },
    })

    const twinkPrices = [
      TWINKS_PRICE.FIRST_TWINK,
      TWINKS_PRICE.SECOND_TWINK,
      TWINKS_PRICE.THIRD_TWINK,
    ]

    const requiredMoney = twinkPrices[countTwinks]

    if (currentUser.money < requiredMoney) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }

    currentUser.money -= requiredMoney

    const twinkData = {
      username: twinkName,
      isTwink: true,
      mainUserName: currentUser.username,
    }

    const newUserTwinkInUsers = this.userRepositry.create({
      ...twinkData,
      realname: twinkName.toLowerCase(),
      ip: currentUser.ip,
      lastlogin: currentUser.lastlogin,
      x: currentUser.x,
      y: currentUser.y,
      z: currentUser.z,
      world: currentUser.world,
      regdate: new Date().getMilliseconds(),
      regip: currentUser.regip,
    })

    const newUserTwinkInWl = this.whitelistRepository.create({
      ...twinkData,
      discordUserId: currentUserInWl.discordUserId,
      discordUserRoles: currentUserInWl.discordUserRoles,
    })

    await this.userRepositry.save([currentUser, newUserTwinkInUsers])
    await this.whitelistRepository.save(newUserTwinkInWl)
  }
}
