import { Body, Controller, Post } from '@nestjs/common'
import { LiqPayService } from './liq-pay.service'
import { CreateOrderBodyDto } from './dtos-request'

@Controller('liqpay')
export class LiqPayController {
  constructor(private readonly liqpayService: LiqPayService) {}

  @Post()
  async createOrder(@Body() { username }: CreateOrderBodyDto): Promise<any> {
    return this.liqpayService.createPaymentOrder(username)
  }
}
