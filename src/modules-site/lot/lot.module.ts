import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { Lot } from 'src/entities/lot.entity'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/modules-site/auth/auth.module'
import { UserController } from 'src/modules-site/user/controllers'
import { UserService } from 'src/modules-site/user/services'

import { LotController } from './controllers'

import { LotService } from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Item, Lot, ItemTicket]),
    AuthModule,
  ],
  controllers: [UserController, LotController],
  providers: [UserService, LotService],
})
export class LotModule {}
