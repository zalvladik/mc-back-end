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
import { CacheService } from 'src/shared/services/cache'
import { EnchantMeta } from 'src/entities/enchant-meta.entity'
import { Whitelist } from 'src/entities/whitelist.entity'
import { DiscordBotService } from 'src/shared/services/discordBot/discordBot.service'
import { Lot } from 'src/entities/lot.entity'
import { UserStats } from 'src/entities/user-stats.entity'
import {
  UserPlayerStatsController,
  UserItemsController,
  UserMoneyController,
  UserShulkersController,
} from './controllers'

import {
  UserPlayerStatsService,
  UserItemsService,
  UserMoneyService,
  UserShulkersService,
} from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStats,
      User,
      Advancements,
      SrPlayer,
      SrPlayerSkin,
      Item,
      ItemTicket,
      Shulker,
      EnchantMeta,
      Whitelist,
      Lot,
    ]),
  ],
  controllers: [
    UserPlayerStatsController,
    UserMoneyController,
    UserItemsController,
    UserShulkersController,
  ],
  providers: [
    UserPlayerStatsService,
    JwtService,
    TokenService,
    UserMoneyService,
    UserItemsService,
    UserShulkersService,
    CacheService,
    DiscordBotService,
  ],
})
export class McUserModule {}
