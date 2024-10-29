import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from 'src/entities/user.entity'

import { WorldExpansionPayments } from 'src/entities/world-expansion-payments.entity'
import { WorldExpansion } from 'src/entities/world-expansion.entity'

import { McFetchingService } from 'src/shared/services/mcFetching/mcFetching.service'
import { DiscordBotService } from 'src/shared/services/discordBot/discordBot.service'
import { Whitelist } from 'src/entities/whitelist.entity'
import { AuthModule } from '../auth/auth.module'
import {
  WorldExpansionPaymentsService,
  WorldExpansionService,
} from './services'
import {
  WorldExpansionController,
  WorldExpansionPaymentsController,
} from './controllers'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      WorldExpansionPayments,
      WorldExpansion,
      Whitelist,
    ]),
    AuthModule,
  ],
  controllers: [WorldExpansionController, WorldExpansionPaymentsController],
  providers: [
    WorldExpansionService,
    WorldExpansionPaymentsService,
    McFetchingService,
    DiscordBotService,
  ],
})
export class WorldExpansionModule {}
