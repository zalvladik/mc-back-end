import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { ItemTicket } from 'src/entities/item-ticket.entity'

@Injectable()
export class ItemTicketService {
  constructor(
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
  ) {}

  async getItemTicketsCountSlots(
    id: number,
    realname: string,
  ): Promise<{ countSlots: number }> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id, inventory: { realname } },
      relations: ['items'],
    })

    if (!itemTicket) throw new NotFoundException('Item ticket not found')

    return { countSlots: itemTicket.items.length }
  }
}
