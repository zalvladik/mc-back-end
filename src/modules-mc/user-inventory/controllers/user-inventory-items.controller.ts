import { Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserInventoryItemsService } from '../services'

import {
  AddItemsToUserInventoryBodyDto,
  PullItemsFromInventoryParamDto,
} from '../dtos-request'
import type { PullItemsFromInventoryResponseDto } from '../dtos-responses'

@Controller('mc/user_inventory/items')
@ApiTags('mc/user_inventory/items')
export class UserInventoryItemsController {
  constructor(
    private readonly userInventoryItemsService: UserInventoryItemsService,
  ) {}

  @Post()
  @HttpCode(201)
  async addItemsToInventory(
    @Body() { realname, data }: AddItemsToUserInventoryBodyDto,
  ): Promise<void> {
    await this.userInventoryItemsService.addItemsToInventory(data, realname)
  }

  @Put('/:itemTicketid')
  @HttpCode(201)
  async pullItemsFromInventory(
    @Param() { itemTicketid }: PullItemsFromInventoryParamDto,
  ): Promise<PullItemsFromInventoryResponseDto> {
    return this.userInventoryItemsService.pullItemsFromInventory(itemTicketid)
  }
}
