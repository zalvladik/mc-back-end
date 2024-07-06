import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ShulkerItem } from 'src/entities/shulker-item.entity'
import { Shulker } from 'src/entities/shulker.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import type { GetShulkerItemsFromUserResponseDto } from '../dtos-response'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(User)
    private readonly userReposetory: Repository<User>,
    @InjectRepository(ShulkerItem)
    private readonly shulkerItemReposetory: Repository<ShulkerItem>,
    @InjectRepository(Shulker)
    private readonly shulkerReposetory: Repository<Shulker>,
  ) {}

  async getUserShulkers(id: number): Promise<Shulker[]> {
    const user = await this.userReposetory.findOne({
      where: { id },
      relations: ['shulkers'],
    })

    return user.shulkers
  }

  async getShulkerItems(
    id: number,
  ): Promise<GetShulkerItemsFromUserResponseDto[]> {
    const shulker: Shulker = await this.shulkerReposetory.findOne({
      where: { id },
      relations: ['shulkerItems'],
    })

    if (!shulker) {
      throw new NotFoundException('Такого шалкера не існує')
    }

    const { shulkerItems } = shulker

    return shulkerItems.map(({ serialized, ...rest }) => rest)
  }
}
