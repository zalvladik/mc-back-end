import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from 'src/entities/user.entity'
import { TokenService } from './token.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TokenService, JwtService],
  exports: [TokenService, JwtService],
})
export class TokenModule {}
