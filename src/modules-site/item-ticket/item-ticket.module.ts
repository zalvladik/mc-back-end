import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { User } from 'src/entities/user.entity'
import { UserService } from 'src/modules-site/user/services'

import { Lot } from 'src/entities/lot.entity'
import { ItemTicketController } from './controllers'

import { ItemTicketService } from './services'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemTicket, Item, User, Lot]),
    AuthModule,
  ],
  controllers: [ItemTicketController],
  providers: [ItemTicketService, UserService],
})
export class ItemTicketModule {}
