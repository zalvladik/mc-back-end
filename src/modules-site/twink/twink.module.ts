import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from 'src/modules-site/auth/auth.module'
import { User } from 'src/entities/user.entity'
import { McWhitelist } from 'src/entities/mc-whitelist.entity'
import { TwinkController } from './controllers'

import { TwinkService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([User, McWhitelist]), AuthModule],
  controllers: [TwinkController],
  providers: [TwinkService],
})
export class TwinkModule {}
