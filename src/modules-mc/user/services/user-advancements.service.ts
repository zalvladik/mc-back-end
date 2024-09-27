import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Advancements } from 'src/entities/advancements.entity'

@Injectable()
export class UserAdvancementsService {
  constructor(
    @InjectRepository(Advancements)
    private readonly advancementsRepository: Repository<Advancements>,
  ) {}

  async putAdvancements(username: string, data: string[]): Promise<void> {
    const userAdvancement = await this.advancementsRepository.findOne({
      where: { username },
    })

    if (!userAdvancement) {
      throw new NotFoundException(`Гравця ${username} не знайдно`)
    }

    userAdvancement.advancements = data
    userAdvancement.rating = data.length

    await this.advancementsRepository.update(
      userAdvancement.id,
      userAdvancement,
    )
  }
}
