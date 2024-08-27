import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { Lot } from 'src/entities/lot.entity'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/modules-site/auth/auth.module'
import { UserController } from 'src/modules-site/user/controllers'
import { UserService } from 'src/modules-site/user/services'

import { Shulker } from 'src/entities/shulker.entity'
import { McUserNotificationService } from 'src/shared/services/mcUserNotification/mcUserNotification.service'
import { TradeHistory } from 'src/entities/trade-history.entity'
import {
  LotItemController,
  LotController,
  LotShulkerController,
} from './controllers'

import { LotItemService, LotShulkerService, LotService } from './services'
import { LotTradeHistoryController } from './controllers/lot-trade-history.controller'
import { LotTradeHistoryService } from './services/lot-trade-history.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Item,
      Lot,
      ItemTicket,
      Shulker,
      TradeHistory,
    ]),
    AuthModule,
  ],
  controllers: [
    UserController,
    LotItemController,
    LotController,
    LotShulkerController,
    LotTradeHistoryController,
  ],
  providers: [
    UserService,
    LotItemService,
    LotShulkerService,
    LotService,
    LotTradeHistoryService,
    McUserNotificationService,
  ],
})
export class LotModule {}
