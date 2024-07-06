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
  AddItemsToUserConfirmBodyDto,
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
    @Body() { username, data, cacheId }: AddItemsToUserBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUser(data, username, cacheId)
  }

  @Post('confirm')
  @HttpCode(201)
  async addItemsToUserConfirm(
    @Body() { cacheId, username }: AddItemsToUserConfirmBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUserConfirm(username, cacheId)
  }

  @Put('/pull/:itemTicketId')
  @HttpCode(201)
  async pullItemsFromUser(
    @Param() { itemTicketId }: PullItemsFromUserParamDto,
  ): Promise<PullItemsFromUserResponseDto> {
    return this.userItemsService.pullItemsFromUser(itemTicketId)
  }

  @Delete('/delete/:itemTicketId/:username')
  @HttpCode(200)
  async deleteItemsFromUser(
    @Param() { itemTicketId, username }: DeleteItemsFromUserParamDto,
  ): Promise<void> {
    await this.userItemsService.deleteItemsFromUser(username, itemTicketId)
  }
}
