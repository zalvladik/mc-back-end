import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { User } from 'src/entities/user.entity'
import { Whitelist } from 'src/entities/whitelist.entity'
import { UserStats } from 'src/entities/user-stats.entity'
import type { GetUserPlaytimeByIdResponseDto } from '../dtos-response'

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(Advancements)
    private readonly advancementsRepository: Repository<Advancements>,

    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,
  ) {}

  async getAdvancements(): Promise<Advancements[]> {
    return this.advancementsRepository.find({
      select: ['rating', 'id'],
    })
  }

  async getUserAdvancementsByUserId(id: number): Promise<Advancements> {
    const userAdvancement = await this.advancementsRepository.findOne({
      where: { user: { id } },
    })

    if (!userAdvancement) {
      const user = await this.userRepository.findOne({
        where: { id },
      })

      const newUserAdvancement = this.advancementsRepository.create({
        user,
        advancements: [],
        rating: 0,
      })

      await this.advancementsRepository.save(newUserAdvancement)

      return newUserAdvancement
    }

    return userAdvancement
  }

  async getUserPlayTimeByUserName(
    username: string,
  ): Promise<GetUserPlaytimeByIdResponseDto> {
    return this.userStatsRepository.findOne({
      where: { user: { username } },
      select: ['afkTime', 'playTime'],
    })
  }
}
