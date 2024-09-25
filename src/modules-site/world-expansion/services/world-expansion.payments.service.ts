import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WorldExpansion } from 'src/entities/world-expansion.entity'

import { Repository } from 'typeorm'
import { WorldExpansionPayments } from 'src/entities/world-expansion-payments.entity'
import { User } from 'src/entities/user.entity'
import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import type { CreateWorldsExpansionPeymantsProps } from '../types'
import type { GetTopWorldsExpansionPeymentsQueryDto } from '../dtos.request'

@Injectable()
export class WorldExpansionPaymentsService {
  constructor(
    @InjectRepository(WorldExpansion)
    private readonly worldExpansionRepository: Repository<WorldExpansion>,
    @InjectRepository(WorldExpansionPayments)
    private readonly worldExpansionPaymentsRepository: Repository<WorldExpansionPayments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mcFetchingService: McFetchingService,
  ) {}

  async getTopWorldsExpansionPeyments({
    worldId,
  }: GetTopWorldsExpansionPeymentsQueryDto): Promise<WorldExpansionPayments[]> {
    const lastExpansion = await this.worldExpansionRepository.findOne({
      where: { id: worldId },
    })

    const topDonors = await this.worldExpansionPaymentsRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.user', 'user')
      .where('payment.world_expansion_id = :worldExpansionId', {
        worldExpansionId: lastExpansion.id,
      })
      .select('user.username', 'username')
      .addSelect('SUM(payment.money)', 'totalDonated')
      .groupBy('payment.userId')
      .orderBy('totalDonated', 'DESC')
      .getRawMany()

    return topDonors
  }

  async createWorldsExpansionPeymants({
    worldType,
    money,
    userId,
  }: CreateWorldsExpansionPeymantsProps): Promise<WorldExpansionPayments> {
    const lastExpansion = await this.worldExpansionRepository.findOne({
      where: { worldType },
      order: { createdAt: 'DESC' },
    })

    if (lastExpansion.completedAt || lastExpansion.isCompleted) {
      throw new ConflictException(
        'Ще не був створений збір на розширення світу',
      )
    }

    let moneyForPayment: number = money

    const user = await this.userRepository.findOne({ where: { id: userId } })

    const howMuchNeedForComplete =
      lastExpansion.cost - lastExpansion.moneyStorage

    if (howMuchNeedForComplete < money) {
      moneyForPayment = howMuchNeedForComplete
    }

    lastExpansion.moneyStorage += moneyForPayment
    lastExpansion.completedAt = new Date()
    lastExpansion.isCompleted = true

    user.money -= moneyForPayment

    const worldExpansionPayment = this.worldExpansionPaymentsRepository.create({
      money: moneyForPayment,
      user,
      createdAt: new Date(),
      worldExpansion: lastExpansion,
    })

    await this.mcFetchingService.worldExansion({
      lvl: lastExpansion.lvl,
      worldType: lastExpansion.worldType,
    })

    await this.userRepository.save(user)
    await this.worldExpansionRepository.save(lastExpansion)
    await this.worldExpansionPaymentsRepository.save(worldExpansionPayment)

    return worldExpansionPayment
  }
}
