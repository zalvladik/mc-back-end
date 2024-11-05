import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { User } from 'src/entities/user.entity'
import { Whitelist } from 'src/entities/whitelist.entity'
import { DiscordBotService } from 'src/shared/services/discordBot/discordBot.service'
import { UserStats } from 'src/entities/user-stats.entity'
import type { PutPlaytimeProps } from '../types'

@Injectable()
export class UserPlayerStatsService {
  constructor(
    @InjectRepository(Advancements)
    private readonly advancementsRepository: Repository<Advancements>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,
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
    afkTime: newAfkTime,
    playTime: newPlayTime,
  }: PutPlaytimeProps): Promise<void> {
    const user = await this.whitelistRepository.findOne({ where: { username } })

    if (user.isTwink) return

    const isMore48Hourse = newPlayTime - newAfkTime > 172800

    if (isMore48Hourse && user.isNewPlayer) {
      await this.discordBotService.pingUserInChannel(user.discordUserId)

      user.isNewPlayer = false
    }

    let userStats = await this.userStatsRepository.findOne({
      where: { user: { username } },
    })

    if (!userStats) {
      const user = await this.userRepository.findOne({ where: { username } })

      userStats = this.userStatsRepository.create({
        user,
      })
    }

    const lifeHouse =
      newPlayTime - newAfkTime === 0 ? 0 : (newPlayTime - newAfkTime) / 3600

    userStats.afkTime = newAfkTime
    userStats.playTime = newPlayTime
    userStats.points = Math.floor(lifeHouse)

    await this.whitelistRepository.save(user)
    await this.userStatsRepository.save(userStats)
  }
}
