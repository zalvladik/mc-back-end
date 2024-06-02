import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { UserInventory } from 'src/entities/user-inventory.entity'

import {
  UserInventoryController,
  UserInventoryItemsController,
  UserInventoryMoneyController,
} from './controllers'

import {
  UserInventoryItemsService,
  UserInventoryMoneyService,
  UserInventoryService,
} from './services'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInventory, Item, ItemTicket]),
    AuthModule,
  ],
  controllers: [
    UserInventoryMoneyController,
    UserInventoryController,
    UserInventoryItemsController,
  ],
  providers: [
    UserInventoryService,
    UserInventoryMoneyService,
    UserInventoryItemsService,
  ],
})
export class UserInventoryModule {}
