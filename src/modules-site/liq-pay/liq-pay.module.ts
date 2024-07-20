import { Module } from '@nestjs/common'
import { LiqPayService } from './liq-pay.service'
import { LiqPayController } from './liq-pay.controller'

@Module({
  imports: [],
  controllers: [LiqPayController],
  providers: [LiqPayService],
})
export class LiqPayModule {}
