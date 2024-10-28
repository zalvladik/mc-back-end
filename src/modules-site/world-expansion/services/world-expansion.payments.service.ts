import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
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
  private logger = new Logger('WorldExpansionPaymentsService')

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
  }: CreateWorldsExpansionPeymantsProps): Promise<void> {
    const lastExpansion = await this.worldExpansionRepository.findOne({
      where: { worldType },
      order: { createdAt: 'DESC' },
    })

    if (lastExpansion.completedAt || lastExpansion.isCompleted) {
      throw new ConflictException(
        'Ще не був створений збір на розширення світу',
      )
    }

    lastExpansion.moneyStorage = Number(lastExpansion.moneyStorage)
    lastExpansion.cost = Number(lastExpansion.cost)

    let moneyForPayment: number = Number(money)

    const user = await this.userRepository.findOne({ where: { id: userId } })

    user.money = Number(user.money)

    const howMuchNeedForComplete =
      lastExpansion.cost - lastExpansion.moneyStorage

    if (howMuchNeedForComplete < money) {
      moneyForPayment = howMuchNeedForComplete
    }

    lastExpansion.moneyStorage += moneyForPayment

    user.money -= moneyForPayment

    if (lastExpansion.moneyStorage >= lastExpansion.cost) {
      try {
        await this.mcFetchingService.worldExansion({
          lvl: lastExpansion.lvl,
          worldType: lastExpansion.worldType,
        })
      } catch (e) {
        this.logger.error(e)

        throw new InternalServerErrorException('Проблеми з розширенням світу')
      }

      lastExpansion.completedAt = new Date()
      lastExpansion.isCompleted = true

      const prevCords = lastExpansion.lvl * 1000 + 10000

      const newCords = lastExpansion.lvl * 1000 + 11000

      const newExpansionCost = Math.round(
        (prevCords * prevCords - newCords * newCords) * 0.00003047619,
      )

      const newExpansion = this.worldExpansionRepository.create({
        createdAt: new Date(),
        lvl: Number(lastExpansion.lvl) + 1,
        worldType: lastExpansion.worldType,
        cost: newExpansionCost,
      })

      await this.worldExpansionRepository.save(newExpansion)
    }

    const worldExpansionPayment = this.worldExpansionPaymentsRepository.create({
      money: moneyForPayment,
      user,
      createdAt: new Date(),
      worldExpansion: lastExpansion,
    })

    await this.userRepository.save(user)
    await this.worldExpansionRepository.save(lastExpansion)
    await this.worldExpansionPaymentsRepository.save(worldExpansionPayment)
  }
}
