import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { User } from 'src/entities/user.entity'

import { ItemTicketController } from './controllers'

import { ItemTicketService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([ItemTicket, Item, User])],
  controllers: [ItemTicketController],
  providers: [ItemTicketService],
})
export class McItemTicketModule {}
