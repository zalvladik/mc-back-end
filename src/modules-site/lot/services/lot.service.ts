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

import type { CreateLotServiceT, GetUserLotsProps } from '../types'
import type {
  CreateLotResponseDto,
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'
import type { GetLotsQuaryDto } from '../dtos-request'

@Injectable()
export class LotService {
  constructor(
    private readonly userInventoryService: UserInventoryService,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async getLots({
    page = 1,
    limit = 8,
    category,
    display_nameOrType,
  }: GetLotsQuaryDto): Promise<GetLotsResponseDto> {
    const queryBuilder = this.lotRepository
      .createQueryBuilder('lot')
      .innerJoinAndSelect('lot.item', 'item')
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'lot',
        'item.id',
        'item.amount',
        'item.type',
        'item.display_name',
        'item.description',
        'item.categories',
      ])

    if (category) {
      queryBuilder.andWhere('FIND_IN_SET(:category, item.categories)', {
        category,
      })
    }

    if (display_nameOrType) {
      queryBuilder.andWhere(
        '(item.display_name LIKE :display_nameOrType OR item.type LIKE :display_nameOrType)',
        {
          display_nameOrType: `%${display_nameOrType}%`,
        },
      )
    }

    const [lots, totalItems] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalPages,
      lots,
    }
  }

  async getUserLots({ userInventory }: GetUserLotsProps): Promise<Lot[]> {
    return this.lotRepository
      .createQueryBuilder('lot')
      .innerJoinAndSelect('lot.item', 'item')
      .where('item.inventory.id = :userInventory', { userInventory })
      .select([
        'lot',
        'item.id',
        'item.amount',
        'item.type',
        'item.display_name',
        'item.description',
        'item.categories',
      ])
      .getMany()
  }

  async createLot({
    userInventoryId,
    itemId,
    price,
    realname,
  }: CreateLotServiceT): Promise<CreateLotResponseDto> {
    const userInventory =
      await this.userInventoryService.findUserInventoryById(userInventoryId)

    const didExistItem = didExistItemInInventory(userInventory.items, itemId)

    if (!didExistItem) throw new NotFoundException('Предмет не знайдено')

    const currentItem = await this.itemRepository.findOne({
      where: { id: didExistItem.id },
      relations: ['lot'],
    })

    if (currentItem.lot) {
      throw new ConflictException('Для цього предмет уже виставлений лот')
    }

    const newLot = this.lotRepository.create({
      realname,
      price,
      item: currentItem,
    })

    currentItem.lot = newLot

    await this.lotRepository.save(newLot)
    await this.itemRepository.save(currentItem)

    const { serialized, lot, ...rest } = currentItem

    return { id: newLot.id, price, item: { ...rest } }
  }

  async buyLot(lotId: number, byuerUserInventoryId: number): Promise<void> {
    const lotMetaData = await this.lotRepository.findOne({
      where: { id: lotId },
      relations: ['item', 'item.inventory'],
    })

    if (!lotMetaData) throw new NotFoundException('Лот не знайдено')

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

  async deleteLot(id: number): Promise<DeleteUserLotResponseDto> {
    const itemFromLot = await this.itemRepository.findOne({
      where: { lot: { id } },
      select: [
        'id',
        'amount',
        'type',
        'display_name',
        'description',
        'categories',
      ],
    })

    const deletedLot = await this.lotRepository.delete(id)

    if (!deletedLot.affected) throw new NotFoundException('Lot not found')

    return { lotId: id, item: itemFromLot }
  }
}
