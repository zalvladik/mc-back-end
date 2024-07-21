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
import { McAuthModule } from './modules-mc/auth/auth.module'
import { WhitelistModule } from './modules-site/whitelist/whitelist.module'

const siteModule = [
  AuthModule,
  TokenModule,
  UserModule,
  LotModule,
  ItemTicketModule,
  WhitelistModule,
]

const mcModule = [McItemTicketModule, McUserModule, McUserModule, McAuthModule]

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
