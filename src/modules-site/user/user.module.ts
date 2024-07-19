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
  UserVipController,
} from './controllers'

import {
  UserAdvancementsService,
  UserSkinService,
  UserItemsService,
  UserService,
  UserShulkersService,
  UserVipService,
} from './services'

import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/services'

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
    UserVipController,
  ],
  providers: [
    UserService,
    UserItemsService,
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserSkinService,
    UserShulkersService,
    UserVipService,
    AuthService,
  ],
  exports: [UserVipService, JwtService],
})
export class UserModule {}
