import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LotModule } from 'src/modules-site/lot/lot.module'
import { AuthModule } from 'src/modules-site/auth/auth.module'
import { ItemTicketModule } from 'src/modules-site/item-ticket/item-ticket.module'
import { UserModule } from 'src/modules-site/user/user.module'
import { TokenModule } from 'src/shared/services/token/token.module'
import { McUserModule } from './modules-mc/user/user.module'
import { McItemTicketModule } from './modules-mc/item-ticket/item-ticket.module'
import { AppConfig, DatabaseConfig } from './config'
import { PpModule } from './modules-site/pp/pp.module'
import { DiscordBotModule } from './shared/services/discordBot/discordBot.module'
import { WlEndModule } from './modules-site/wl-end/wl-end.module'
import { TwinkModule } from './modules-site/twink/twink.module'
import { WorldExpansionModule } from './modules-site/world-expansion/world-expansion.module'
import { CrystalModule } from './modules-site/crystal/crystal.module'

const siteModule = [
  AuthModule,
  TokenModule,
  UserModule,
  LotModule,
  ItemTicketModule,
  WlEndModule,
  DiscordBotModule,
  PpModule,
  TwinkModule,
  WorldExpansionModule,
  CrystalModule,
]

const mcModule = [McItemTicketModule, McUserModule, McUserModule]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    ...siteModule,
    ...mcModule,
  ],
})
export class AppModule {}
