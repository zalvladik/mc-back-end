import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { Lot } from 'src/entities/lot.entity'
import { UserInventory } from 'src/entities/user-inventory.entity'
import { AuthModule } from 'src/modules-site/auth/auth.module'
import {
  UserInventoryController,
  UserInventoryMoneyController,
} from 'src/modules-site/user-inventory/controllers'
import {
  UserInventoryMoneyService,
  UserInventoryService,
} from 'src/modules-site/user-inventory/services'

import { AuctionController } from './controllers'

import { AuctionService } from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInventory, Item, Lot, ItemTicket]),
    AuthModule,
  ],
  controllers: [
    UserInventoryController,
    UserInventoryMoneyController,
    AuctionController,
  ],
  providers: [UserInventoryService, UserInventoryMoneyService, AuctionService],
})
export class AuctionModule {}
