import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { User } from 'src/entities/user.entity'
import { UserUUID } from 'src/entities/user-uuid.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import {
  UserAdvancementsController,
  UserController,
  UserItemsController,
  UserMoneyController,
} from './controllers'

import {
  UserAdvancementsService,
  UserService,
  UserItemsService,
  UserMoneyService,
} from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserUUID,
      Advancements,
      SrPlayer,
      SrPlayerSkin,
      Item,
      ItemTicket,
    ]),
  ],
  controllers: [
    UserController,
    UserAdvancementsController,
    UserMoneyController,
    UserItemsController,
  ],
  providers: [
    UserService,
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserMoneyService,
    UserItemsService,
  ],
})
export class McUserModule {}
