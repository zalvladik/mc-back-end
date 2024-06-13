import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserInventory } from 'src/entities/user-inventory.entity'

@Injectable()
export class UserInventoryService {
  constructor(
    @InjectRepository(UserInventory)
    private readonly userInventoryRepository: Repository<UserInventory>,
  ) {}

  async getUserInvenory(
    id: number,
    relations?: string[],
  ): Promise<UserInventory> {
    return this.userInventoryRepository.findOne({
      where: { id },
      relations: relations ?? ['items', 'itemTickets'],
    })
  }

  async updateUserInventory(userInventory: UserInventory): Promise<void> {
    await this.userInventoryRepository.save(userInventory)
  }

  async findUserInventoryById(inventoryId: number): Promise<UserInventory> {
    const userInventory = await this.userInventoryRepository.findOne({
      where: { id: inventoryId },
      relations: ['items'],
    })

    if (!userInventory) throw new NotFoundException('User inventory not found')

    return userInventory
  }
}
