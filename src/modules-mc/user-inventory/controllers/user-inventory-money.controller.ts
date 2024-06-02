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

import { UserInventoryMoneyService } from '../services'

import {
  AddMoneyToUserInventoryBodyDto,
  GetMoneyFromUserInventoryParamDto,
  PullMoneyFromUserInventoryBodyDto,
} from '../dtos-request'

import type {
  AddMoneyToUserInventoryResponseDto,
  GetMoneyToUserInventoryResponseDto,
} from '../dtos-responses'

@Controller('mc/user_inventory/money')
@ApiTags('mc/user_inventory/money')
export class UserInventoryMoneyController {
  constructor(
    private readonly userInventoryMoneyService: UserInventoryMoneyService,
  ) {}

  @Get(':realname')
  @HttpCode(200)
  async getMoneyFromInventory(
    @Param() { realname }: GetMoneyFromUserInventoryParamDto,
  ): Promise<{ money: number }> {
    return this.userInventoryMoneyService.getMoneyByRealname(realname)
  }

  @Post()
  @HttpCode(201)
  async addMoneyToInventory(
    @Body() { realname, money }: AddMoneyToUserInventoryBodyDto,
  ): Promise<AddMoneyToUserInventoryResponseDto> {
    return this.userInventoryMoneyService.addMoneyToInventory(money, realname)
  }

  @Put()
  @HttpCode(201)
  async removeMoneyFromInventory(
    @Body() { realname, money }: PullMoneyFromUserInventoryBodyDto,
  ): Promise<GetMoneyToUserInventoryResponseDto> {
    return this.userInventoryMoneyService.removeMoneyFromInventory(
      money,
      realname,
    )
  }
}
