import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/modules-site/auth/auth.module'
import { User } from 'src/entities/user.entity'
import { Whitelist } from 'src/entities/whitelist.entity'
import { TwinkController } from './controllers'

import { TwinkService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([User, Whitelist]), AuthModule],
  controllers: [TwinkController],
  providers: [TwinkService],
})
export class TwinkModule {}
