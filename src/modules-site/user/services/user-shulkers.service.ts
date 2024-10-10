import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Shulker } from 'src/entities/shulker.entity'
import { IsNull, Repository } from 'typeorm'
import type { GetShulkerItemsFromUserResponseDto } from '../dtos-response'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(Shulker)
    private readonly shulkerReposetory: Repository<Shulker>,
  ) {}

  async getUserShulkers(id: number): Promise<Shulker[]> {
    const userShulkersWithoutLot =
      (await this.shulkerReposetory.find({
        where: { lot: IsNull(), isTaken: false, user: { id } },
      })) ?? []

    const userShulkersWithByetLot =
      (await this.shulkerReposetory.find({
        where: { lot: { isSold: true }, isTaken: false, user: { id } },
      })) ?? []

    return [...userShulkersWithoutLot, ...userShulkersWithByetLot]
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

    return shulker?.items.map(({ serialized, ...rest }) => rest) ?? []
  }
}
