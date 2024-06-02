import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { Lot } from 'src/entities/lot.entity'
import { UserInventoryService } from 'src/modules-site/user-inventory/services'
import { didExistItemInInventory } from 'src/shared/helpers/didExistItemInInventory'

import type { CreateLotServiceT } from '../types'

@Injectable()
export class AuctionService {
  constructor(
    private readonly userInventoryService: UserInventoryService,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createLot({
    userInventoryId,
    itemId,
    price,
  }: CreateLotServiceT): Promise<Lot> {
    const userInventory =
      await this.userInventoryService.findUserInventoryById(userInventoryId)

    const didExistItem = didExistItemInInventory(userInventory.items, itemId)

    if (!didExistItem) {
      throw new NotFoundException('Item not found in inventory')
    }

    const currentItem = await this.itemRepository.findOne({
      where: { id: didExistItem.id },
      relations: ['lot'],
    })

    if (currentItem.lot) {
      throw new ConflictException('This lot is already exist')
    }

    const newLot = this.lotRepository.create({
      price,
      item: currentItem,
    })

    currentItem.lot = newLot

    await this.lotRepository.save(newLot)
    await this.itemRepository.save(currentItem)

    return newLot
  }

  async buyLot(lotId: number, byuerUserInventoryId: number): Promise<void> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId },
      relations: ['item', 'item.inventory'],
    })

    if (!lotMetaData) throw new NotFoundException('Lot not found')

    const buyerUserInventory =
      await this.userInventoryService.findUserInventoryById(
        byuerUserInventoryId,
      )

    if (!buyerUserInventory) {
      throw new NotFoundException("Buyer's inventory not found")
    }

    if (lotMetaData.price > buyerUserInventory.money) {
      throw new HttpException('Not enough money', HttpStatus.PAYMENT_REQUIRED)
    }

    const sellerUserInventory = lotMetaData.item.inventory

    buyerUserInventory.money -= lotMetaData.price
    sellerUserInventory.money += lotMetaData.price

    const updatedItem = { ...lotMetaData.item, inventory: buyerUserInventory }

    await this.userInventoryService.updateUserInventory(buyerUserInventory)
    await this.userInventoryService.updateUserInventory(sellerUserInventory)

    await this.itemRepository.save(updatedItem)
    await this.deleteLot(lotId)
  }

  async deleteLot(id: number): Promise<{ id: number }> {
    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { id }
  }
}
