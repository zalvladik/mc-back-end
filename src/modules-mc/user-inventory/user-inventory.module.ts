import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventory } from 'src/entities/user-inventory.entity'

import {
  UserInventoryItemsController,
  UserInventoryMoneyController,
} from './controllers'

import {
  UserInventoryItemsService,
  UserInventoryMoneyService,
} from './services'

@Module({
  imports: [TypeOrmModule.forFeature([UserInventory, Item, ItemTicket])],
  controllers: [UserInventoryMoneyController, UserInventoryItemsController],
  providers: [UserInventoryMoneyService, UserInventoryItemsService],
})
export class McUserInventoryModule {}
