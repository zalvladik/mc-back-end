import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { User } from 'src/entities/user.entity'
import { Whitelist } from 'src/entities/whitelist.entity'
import { DiscordBotService } from 'src/shared/services/discordBot/discordBot.service'
import type { PutPlaytimeProps } from '../types'

@Injectable()
export class UserPlayerStatsService {
  constructor(
    @InjectRepository(Advancements)
    private readonly advancementsRepository: Repository<Advancements>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
    private readonly discordBotService: DiscordBotService,
  ) {}

  async putAdvancements(username: string, data: string[]): Promise<void> {
    const userAdvancement = await this.advancementsRepository.findOne({
      where: { user: { username } },
    })

    if (!userAdvancement) {
      const user = await this.userRepository.findOne({
        where: { username },
      })

      if (!user) throw new NotFoundException(`Гравця ${username} не знайдно`)

      const newUserAdvancement = this.advancementsRepository.create({
        user,
        advancements: data,
        rating: data.length,
      })

      await this.advancementsRepository.save(newUserAdvancement)

      return
    }

    userAdvancement.advancements = data
    userAdvancement.rating = data.length

    await this.advancementsRepository.update(
      userAdvancement.id,
      userAdvancement,
    )
  }

  async putPlayTime({
    username,
    afkTime,
    playTime,
  }: PutPlaytimeProps): Promise<void> {
    const user = await this.whitelistRepository.findOne({ where: { username } })

    if (user.isTwink) return

    const isMore48Hourse = playTime - afkTime > 172800

    if (isMore48Hourse && !user.isNewPlayer) {
      await this.discordBotService.pingUserInChannel(user.discordUserId)

      user.isNewPlayer = false
    }

    user.afkTime = afkTime
    user.playTime = playTime

    await this.whitelistRepository.save(user)
  }
}
