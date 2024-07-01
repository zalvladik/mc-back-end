import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserItemsService } from '../services'

import {
  AddItemsToUserBodyDto,
  AddItemsToUserConfirmBodyDto,
  DeleteItemsFromUserQueryDto,
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
    @Body() { itemsStorageId, username }: AddItemsToUserConfirmBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUserConfirm(username, itemsStorageId)
  }

  @Put('/pull/:itemTicketid')
  @HttpCode(201)
  async pullItemsFromUser(
    @Param() { itemTicketid }: PullItemsFromUserParamDto,
  ): Promise<PullItemsFromUserResponseDto> {
    return this.userItemsService.pullItemsFromUser(itemTicketid)
  }

  @Delete('/delete')
  @HttpCode(200)
  async deleteItemsFromUser(
    @Query() { itemTicketid, username }: DeleteItemsFromUserQueryDto,
  ): Promise<void> {
    await this.userItemsService.deleteItemsFromUser(username, itemTicketid)
  }
}
