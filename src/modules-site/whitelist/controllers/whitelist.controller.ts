import { Body, Controller, Post } from '@nestjs/common'
import { WhitelistService } from '../services'
import { CreateOrderBodyDto } from '../dtos-request'

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  async createOrder(@Body() body: any): Promise<any> {
    return this.whitelistService.createPaymentOrder(body)
  }
}
