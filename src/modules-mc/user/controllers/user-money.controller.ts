import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserMoneyService } from '../services'

import {
  AddMoneyToUserBodyDto,
  AddMoneyToUserConfirmBodyDto,
  GetMoneyFromUserParamDto,
  PullMoneyFromUserBodyDto,
  PullMoneyFromUserConfirmBodyDto,
} from '../dtos-request'

import type {
  AddMoneyToUserResponseDto,
  GetMoneyToUserResponseDto,
} from '../dtos-responses'

@Controller('mc/user/money')
@ApiTags('mc/user/money')
export class UserMoneyController {
  constructor(private readonly userMoneyService: UserMoneyService) {}

  @Get(':username')
  @HttpCode(200)
  async getMoneyFrom(
    @Param() { username }: GetMoneyFromUserParamDto,
  ): Promise<{ money: number }> {
    return this.userMoneyService.getMoneyByUserName(username)
  }

  @Post()
  @HttpCode(201)
  async addMoneyToUser(
    @Body() { username, money, moneyStorageId }: AddMoneyToUserBodyDto,
  ): Promise<AddMoneyToUserResponseDto> {
    return this.userMoneyService.addMoneyToUser(money, username, moneyStorageId)
  }

  @Post('confirm')
  @HttpCode(200)
  async addMoneyToUserConfirm(
    @Body() { moneyStorageId }: AddMoneyToUserConfirmBodyDto,
  ): Promise<void> {
    await this.userMoneyService.addMoneyToUserConfirm(moneyStorageId)
  }

  @Put()
  @HttpCode(201)
  async removeMoneyFromUser(
    @Body() { username, money, moneyStorageId }: PullMoneyFromUserBodyDto,
  ): Promise<GetMoneyToUserResponseDto> {
    return this.userMoneyService.removeMoneyFromUser(
      money,
      username,
      moneyStorageId,
    )
  }

  @Put('confirm')
  @HttpCode(201)
  async removeMoneyFromUserConfirm(
    @Body() { moneyStorageId }: PullMoneyFromUserConfirmBodyDto,
  ): Promise<void> {
    await this.userMoneyService.removeMoneyFromUserConfirm(moneyStorageId)
  }
}
