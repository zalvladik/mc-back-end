import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist'
import { LiqPayService, LiqPayUserService } from './services'
import { LiqPayController, LiqPayUserController } from './controllers'

@Module({
  imports: [TypeOrmModule.forFeature([Whitelist])],
  controllers: [LiqPayController, LiqPayUserController],
  providers: [LiqPayService, LiqPayUserService],
})
export class LiqPayModule {}
