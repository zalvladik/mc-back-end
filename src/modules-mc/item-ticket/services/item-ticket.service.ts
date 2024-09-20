import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { ItemTicket } from 'src/entities/item-ticket.entity'
import { User } from 'src/entities/user.entity'

@Injectable()
export class ItemTicketService {
  constructor(
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getItemTicketsCountSlots(
    id: number,
    username: string,
  ): Promise<{ countSlots: number }> {
    const currentUser = await this.userRepository.findOne({
      where: { username, isTwink: false },
    })

    if (!currentUser) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id, user: { username } },
      relations: ['items'],
    })

    if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

    return { countSlots: itemTicket.items.length }
  }
}
