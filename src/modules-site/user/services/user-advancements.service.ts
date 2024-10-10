import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { User } from 'src/entities/user.entity'

@Injectable()
export class UserAdvancementsService {
  constructor(
    @InjectRepository(Advancements)
    private readonly advancementsRepository: Repository<Advancements>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
