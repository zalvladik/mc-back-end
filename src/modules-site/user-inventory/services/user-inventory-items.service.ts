import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { IsNull, Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import type { GetItemsFromInventoryResponseDto } from '../dtos-responses'

@Injectable()
export class UserInventoryItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getItemsFromInventory(
    id: number,
  ): Promise<GetItemsFromInventoryResponseDto[]> {
    return this.itemRepository.find({
      where: { inventory: { id }, itemTicket: IsNull(), lot: IsNull() },
      select: [
        'id',
        'amount',
        'type',
        'display_name',
        'description',
        'categories',
      ],
    })
  }
}
