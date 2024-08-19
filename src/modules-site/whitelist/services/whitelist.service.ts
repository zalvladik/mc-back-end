import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'
import { getKievTime } from 'src/shared/helpers/getKievTime'
import type { AddUserToWhiteListBodyDto } from '../dtos-request'

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async addUser({
    nickname,
    discordUserId,
  }: AddUserToWhiteListBodyDto): Promise<void> {
    const userByDiscordUserId = await this.whitelistRepository.findOne({
      where: { discordUserId },
    })

    if (userByDiscordUserId) {
      throw new ConflictException(
        `Вас уже добавленно в whitelist, ваш нікнейм: ${userByDiscordUserId.user}`,
      )
    }

    const userByNickName = await this.whitelistRepository.findOne({
      where: { user: nickname },
    })

    if (userByNickName) {
      throw new ConflictException(
        `Нік ${nickname} зайнятий, придумайте інший нікнейм.`,
      )
    }

    const newUserInWhitelist = this.whitelistRepository.create({
      user: nickname,
      discordUserId,
      time: getKievTime(),
    })

    await this.whitelistRepository.save(newUserInWhitelist)
  }
}
