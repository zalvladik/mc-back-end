import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorldExpansion } from 'src/entities/world-expansion.entity'
import type { WorldEnum } from 'src/shared/enums'

import { Repository } from 'typeorm'

@Injectable()
export class WorldExpansionService {
  constructor(
    @InjectRepository(WorldExpansion)
    private readonly worldExpansionRepository: Repository<WorldExpansion>,
  ) {}

  async getWorldsExpansion(worldType: WorldEnum): Promise<WorldExpansion> {
    return this.worldExpansionRepository.findOne({
      where: { worldType },
      order: { createdAt: 'DESC' },
    })
  }

  async createWorldsExpansion(
    worldType: WorldEnum,
    cost: number,
  ): Promise<WorldExpansion> {
    const lastExpansion = await this.worldExpansionRepository.findOne({
      where: { worldType },
      order: { createdAt: 'DESC' },
    })

    if (!lastExpansion.completedAt || !lastExpansion.isCompleted) {
      throw new ConflictException(
        'Потрібно завершити попереднє розширення світу',
      )
    }

    const newWorldExpansion = this.worldExpansionRepository.create({
      worldType,
      cost,
      createdAt: new Date(),
      lvl: lastExpansion.lvl + 1,
    })

    await this.worldExpansionRepository.save(newWorldExpansion)

    return newWorldExpansion
  }
}
