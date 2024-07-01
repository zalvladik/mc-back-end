import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from 'src/entities/user.entity'
import { TokenService } from 'src/shared/services/token/token.service'

import { SocketModule } from 'src/shared/services/socket/socket.module'
import { AuthController } from './controllers'

import { AuthService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([User]), SocketModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
