import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from 'src/entities/user.entity'

import { WlEndController } from './wl-end.controller'

import { WlEndService } from './wl-end.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [WlEndController],
  providers: [WlEndService],
})
export class WlEndModule {}
