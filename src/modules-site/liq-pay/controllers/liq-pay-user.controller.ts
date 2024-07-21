import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { LiqPayUserService, LiqPayService } from '../services'
import {
  AddUserToWhiteListBodyDto,
  CheckIsExistUserQueryDto,
} from '../dtos-request'

@Controller('liqpay/user')
export class LiqPayUserController {
  constructor(
    private readonly liqPayUserService: LiqPayUserService,
    private readonly liqPayService: LiqPayService,
  ) {}

  @Get()
  async checkIsExistUser(
    @Query() { username }: CheckIsExistUserQueryDto,
  ): Promise<void> {
    await this.liqPayUserService.checkIsExistUser(username)
  }

  @Post()
  async addUser(
    @Body() { username, transactionId }: AddUserToWhiteListBodyDto,
  ): Promise<void> {
    const isSeccessfulTransaction =
      await this.liqPayService.checkStatus(transactionId)

    if (!isSeccessfulTransaction) {
      throw new NotFoundException('Такої покупки не існує')
    }

    await this.liqPayUserService.addUser(username)
  }
}
