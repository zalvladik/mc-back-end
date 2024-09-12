import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import { PpParticle } from 'src/entities/pp/playerparticles_particle.entity'
import { PpGroup } from 'src/entities/pp/playerparticles_group.entity'
import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import type { AddPpEffectsProps, DeletePpEffectsProps } from '../types'
import type {
  DeletePpParticleResponseDto,
  GetPpParticleResponseDto,
} from '../dtos-response'

@Injectable()
export class PpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PpParticle)
    private readonly ppParticle: Repository<PpParticle>,
    @InjectRepository(PpGroup)
    private readonly ppGroup: Repository<PpGroup>,
    private readonly mcFetchingService: McFetchingService,
  ) {}

  async getPpParticle(id: number): Promise<GetPpParticleResponseDto[]> {
    const userUUID = (
      await this.userRepository.findOne({
        where: { id },
        select: ['uuid'],
      })
    ).uuid

    const playerGroupUUID = await this.ppGroup.findOne({
      where: { owner_uuid: userUUID },
    })

    return this.ppParticle.find({
      where: { group_uuid: playerGroupUUID.uuid },
      select: ['effect', 'style', 'uuid', 'group_uuid'],
    })
  }

  async addPpParticle({
    id,
    style,
    effect,
    username,
  }: AddPpEffectsProps): Promise<void> {
    const userUUID = (
      await this.userRepository.findOne({
        where: { id },
        select: ['uuid'],
      })
    ).uuid

    const playerGroupUUID = await this.ppGroup.findOne({
      where: { owner_uuid: userUUID },
    })

    const ppsPlayer = await this.ppParticle.count({
      where: { group_uuid: playerGroupUUID.uuid },
    })

    if (ppsPlayer >= 3) {
      throw new BadRequestException('У вас може бути тільки 3 еффекти.')
    }

    await this.mcFetchingService.handleAddPP({ effect, style, username })
  }

  async deletePpParticle({
    userId,
    ppUUID,
    username,
  }: DeletePpEffectsProps): Promise<DeletePpParticleResponseDto> {
    const userUUID = (
      await this.userRepository.findOne({
        where: { id: userId },
        select: ['uuid'],
      })
    ).uuid

    const playerGroupUUID = await this.ppGroup.findOne({
      where: { owner_uuid: userUUID },
    })

    const ppsPlayer = await this.ppParticle.findOne({
      where: { group_uuid: playerGroupUUID.uuid, uuid: ppUUID },
    })

    if (!ppsPlayer) {
      throw new BadRequestException('Неправильно вказаний id еффекту')
    }

    await this.mcFetchingService.handleDeletePP({ id: ppsPlayer.id, username })

    return { uuid: ppUUID }
  }
}
