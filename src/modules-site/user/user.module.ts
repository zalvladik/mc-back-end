import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Advancements } from 'src/entities/advancements.entity'
import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { User } from 'src/entities/user.entity'
import { UserUUID } from 'src/entities/user-uuid.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import {
  UserAdvancementsController,
  UserController,
  UserSkinController,
} from './controllers'

import {
  UserAdvancementsService,
  UserService,
  UserSkinService,
} from './services'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserUUID,
      Advancements,
      SrPlayer,
      SrPlayerSkin,
    ]),
    AuthModule,
  ],
  controllers: [UserController, UserAdvancementsController, UserSkinController],
  providers: [
    UserService,
    UserAdvancementsService,
    JwtService,
    TokenService,
    UserSkinService,
  ],
})
export class UserModule {}
