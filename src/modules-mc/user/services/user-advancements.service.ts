import { Injectable, NotFoundException } from '@nestjs/common'
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
}
