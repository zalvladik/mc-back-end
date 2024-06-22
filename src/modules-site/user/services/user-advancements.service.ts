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

  async getAdvancements(): Promise<Advancements[]> {
    return this.advancementsRepository.find({
      select: ['username', 'rating', 'id'],
    })
  }

  async getUserAdvancementsByUserName(username: string): Promise<Advancements> {
    const userAdvancements = await this.advancementsRepository.findOne({
      where: { username },
    })

    if (!userAdvancements)
      throw new NotFoundException(`Гравця ${username} не знайдено`)

    return userAdvancements
  }

  async putAdvancements(username: string, data: object): Promise<void> {
    const userAdvancements = Object.entries(data).reduce(
      (result, [key, { done }]) => {
        if (!done) return result

        if (
          key.includes('minecraft:story') ||
          key.includes('minecraft:nether') ||
          key.includes('minecraft:end') ||
          key.includes('minecraft:adventure') ||
          key.includes('minecraft:husbandry')
        ) {
          if (key.includes('root')) {
            result.push(key.split(':')[1].replace('/', ''))

            return result
          }

          result.push(key.split('/')[1].split('_').join(''))

          return result
        }

        return result
      },
      [],
    )

    const userAdvancement = await this.advancementsRepository.findOne({
      where: { username },
    })

    userAdvancement.advancements = userAdvancements
    userAdvancement.rating = userAdvancements.length

    await this.advancementsRepository.update(
      userAdvancement.id,
      userAdvancement,
    )
  }
}
