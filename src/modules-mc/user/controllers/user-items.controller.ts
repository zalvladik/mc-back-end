import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserItemsService } from '../services'

import {
  AddItemsToUserBodyDto,
  DeleteItemsFromUserParamDto,
  PullItemsFromUserParamDto,
} from '../dtos-request'
import type { PullItemsFromUserResponseDto } from '../dtos-responses'

@Controller('mc/user/items')
@ApiTags('mc/user/items')
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) {}

  @Post()
  @HttpCode(200)
  async addItemsToUser(
    @Body() { username, data, itemsStorageId }: AddItemsToUserBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUser(data, username, itemsStorageId)
  }

  @Post('confirm')
  @HttpCode(201)
  async addItemsToUserConfirm(
    @Body() { itemsStorageId }: AddItemsToUserBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUserConfirm(itemsStorageId)
  }

  @Put('/pull/:itemTicketid')
  @HttpCode(201)
  async pullItemsFromUser(
    @Param() { itemTicketid }: PullItemsFromUserParamDto,
  ): Promise<PullItemsFromUserResponseDto> {
    return this.userItemsService.pullItemsFromUser(itemTicketid)
  }

  @Delete('/delete/:itemTicketid')
  @HttpCode(200)
  async deleteItemsFromUser(
    @Param() { itemTicketid }: DeleteItemsFromUserParamDto,
  ): Promise<void> {
    await this.userItemsService.deleteItemsFromUser(itemTicketid)
  }
}
