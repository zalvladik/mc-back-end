import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { User } from 'src/entities/user.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import { Item } from 'src/entities/item.entity'

import { Shulker } from 'src/entities/shulker.entity'
import {
  UserAdvancementsController,
  UserController,
  UserSkinController,
  UserItemsController,
  UserShulkersController,
} from './controllers'

import {
  UserAdvancementsService,
  UserSkinService,
  UserItemsService,
  UserService,
  UserShulkersService,
} from './services'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Advancements,
      SrPlayer,
      Item,
      SrPlayerSkin,
      Shulker,
    ]),
    AuthModule,
  ],
  controllers: [
    UserController,
    UserItemsController,
    UserAdvancementsController,
    UserSkinController,
    UserShulkersController,
  ],
  providers: [
    UserService,
    UserItemsService,
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserSkinService,
    UserShulkersService,
  ],
})
export class UserModule {}
