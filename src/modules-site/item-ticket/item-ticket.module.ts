import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventory } from 'src/entities/user-inventory.entity'
import { UserInventoryService } from 'src/modules-site/user-inventory/services'

import { ItemTicketController } from './controllers'

import { ItemTicketService } from './services'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemTicket, Item, UserInventory]),
    AuthModule,
  ],
  controllers: [ItemTicketController],
  providers: [ItemTicketService, UserInventoryService],
})
export class ItemTicketModule {}
