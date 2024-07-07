import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Shulker } from 'src/entities/shulker.entity'
import { User } from 'src/entities/user.entity'
import { IsNull, Repository } from 'typeorm'
import type { GetShulkerItemsFromUserResponseDto } from '../dtos-response'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(User)
    private readonly userReposetory: Repository<User>,
    @InjectRepository(Shulker)
    private readonly shulkerReposetory: Repository<Shulker>,
  ) {}

  async getUserShulkers(id: number): Promise<Shulker[]> {
    const user = await this.userReposetory.findOne({
      where: { id, shulkers: { lot: IsNull() } },
      relations: ['shulkers'],
    })

    return user.shulkers
  }

  async getShulkerItems(
    id: number,
  ): Promise<GetShulkerItemsFromUserResponseDto[]> {
    const shulker: Shulker = await this.shulkerReposetory.findOne({
      where: { id },
      relations: ['items'],
    })

    if (!shulker) {
      throw new NotFoundException('Такого шалкера не існує')
    }

    const { items } = shulker

    return items.map(({ serialized, ...rest }) => rest)
  }
}
