import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { User } from 'src/entities/user.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import { Item } from 'src/entities/item.entity'

import {
  UserAdvancementsController,
  UserController,
  UserSkinController,
  UserItemsController,
} from './controllers'

import {
  UserAdvancementsService,
  UserSkinService,
  UserItemsService,
  UserService,
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
    ]),
    AuthModule,
  ],
  controllers: [
    UserController,
    UserItemsController,
    UserAdvancementsController,
    UserSkinController,
  ],
  providers: [
    UserService,
    UserItemsService,
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserSkinService,
  ],
})
export class UserModule {}
