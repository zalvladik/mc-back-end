import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventoryService } from 'src/modules-site/user-inventory/services'

import type {
  CreateItemTicketResponseDto,
  GetItemsFromTicketResponseDto,
} from '../dtos-response'

@Injectable()
export class ItemTicketService {
  constructor(
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly userInventoryService: UserInventoryService,
  ) {}

  async getItemTickets(id: number): Promise<ItemTicket[]> {
    return this.itemTicketRepository.find({
      where: { inventory: { id } },
    })
  }

  async getItemsFromTicket(
    userInventory: number,
    itemTicketId: number,
  ): Promise<GetItemsFromTicketResponseDto[]> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId, inventory: { id: userInventory } },
    })

    if (!itemTicket) throw new NotFoundException('Ticket not found')

    return this.itemRepository.find({
      where: { itemTicket: { id: itemTicketId } },
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

  async createItemTicket(
    itemIds: number[],
    userInventoryId: number,
  ): Promise<CreateItemTicketResponseDto> {
    const coune = await this.itemTicketRepository.count({
      where: {
        inventory: {
          id: userInventoryId,
        },
      },
    })

    if (coune >= 5) {
      throw new HttpException('To much item tickets', HttpStatus.BAD_REQUEST)
    }

    const arrayItems = await this.itemRepository
      .createQueryBuilder('items')
      .whereInIds(itemIds)
      .andWhere('items.inventory.id = :userInventoryId', { userInventoryId })
      .andWhere('items.itemTicket IS NULL')
      .getMany()

    if (!(arrayItems.length === itemIds.length)) {
      throw new NotFoundException('Item not found')
    }

    const newItemTicket = this.itemTicketRepository.create()

    const updatedItems = arrayItems.map((itemData: Item) => {
      return {
        ...itemData,
        itemTicket: newItemTicket,
      }
    })

    const userInventory =
      await this.userInventoryService.getUserInvenory(userInventoryId)

    newItemTicket.inventory = userInventory
    newItemTicket.items = updatedItems

    await this.itemTicketRepository.save(newItemTicket)

    return { id: newItemTicket.id, items: itemIds }
  }
}
