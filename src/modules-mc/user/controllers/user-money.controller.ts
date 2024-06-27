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
  GetMoneyFromUserParamDto,
  PullMoneyFromUserBodyDto,
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
  async addMoneyTo(
    @Body() { username, money }: AddMoneyToUserBodyDto,
  ): Promise<AddMoneyToUserResponseDto> {
    return this.userMoneyService.addMoneyToUser(money, username)
  }

  @Put()
  @HttpCode(201)
  async removeMoneyFrom(
    @Body() { username, money }: PullMoneyFromUserBodyDto,
  ): Promise<GetMoneyToUserResponseDto> {
    return this.userMoneyService.removeMoneyFromUser(money, username)
  }
}