import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { User } from 'src/entities/user.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { Shulker } from 'src/entities/shulker.entity'
import { ShulkerItem } from 'src/entities/shulker-item.entity'
import {
  UserAdvancementsController,
  UserItemsController,
  UserMoneyController,
  UserShulkersController,
} from './controllers'

import {
  UserAdvancementsService,
  UserItemsService,
  UserMoneyService,
  UserShulkersService,
} from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Advancements,
      SrPlayer,
      SrPlayerSkin,
      Item,
      ItemTicket,
      Shulker,
      ShulkerItem,
    ]),
  ],
  controllers: [
    UserAdvancementsController,
    UserMoneyController,
    UserItemsController,
    UserShulkersController,
  ],
  providers: [
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserMoneyService,
    UserItemsService,
    UserShulkersService,
  ],
})
export class McUserModule {}
