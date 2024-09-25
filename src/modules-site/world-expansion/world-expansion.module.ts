import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from 'src/entities/user.entity'

import { WorldExpansionPayments } from 'src/entities/world-expansion-payments.entity'
import { WorldExpansion } from 'src/entities/world-expansion.entity'

import { AuthModule } from '../auth/auth.module'
import { WorldExpansionService } from './services'
import { WorldExpansionController } from './controllers'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WorldExpansionPayments, WorldExpansion]),
    AuthModule,
  ],
  controllers: [WorldExpansionController],
  providers: [WorldExpansionService],
})
export class WorldExpansionModule {}
