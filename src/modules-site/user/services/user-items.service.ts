import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { IsNull, Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { itemMeta } from 'src/shared/constants'
import type { GetItemsFromUserResponseDto } from '../dtos-response'

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getItemsFromUser(id: number): Promise<GetItemsFromUserResponseDto[]> {
    return this.itemRepository.find({
      where: { user: { id }, itemTicket: IsNull(), lot: IsNull() },
      select: itemMeta,
    })
  }
}
