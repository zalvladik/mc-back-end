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
  @HttpCode(201)
  async addItemsTo(
    @Body() { username, data }: AddItemsToUserBodyDto,
  ): Promise<void> {
    await this.userItemsService.addItemsToUser(data, username)
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
