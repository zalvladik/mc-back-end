import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserShulkersService } from '../services'
import type { PullShulkerResponseDto } from '../dtos-responses'

import {
  AddShulkerToUserBodyDto,
  AddShulkerToUserConfirmBodyDto,
  DeleteShulkerParamDto,
  PullShulkerBodyDto,
} from '../dtos-request'

@Controller('mc/user/shulkers')
@ApiTags('mc/user/shulkers')
export class UserShulkersController {
  constructor(private readonly userShulkersService: UserShulkersService) {}

  @Post()
  @HttpCode(200)
  async addShulkerToUser(
    @Body()
    body: AddShulkerToUserBodyDto,
  ): Promise<void> {
    await this.userShulkersService.addShulkerToUser(body)
  }

  @Post('confirm')
  @HttpCode(201)
  async addShulkerToUserConfirm(
    @Body() { cacheId, username }: AddShulkerToUserConfirmBodyDto,
  ): Promise<void> {
    await this.userShulkersService.addShulkerToUserConfirm(username, cacheId)
  }

  @Put('')
  @HttpCode(200)
  async pullShulker(
    @Body() { shulkerId, username }: PullShulkerBodyDto,
  ): Promise<PullShulkerResponseDto> {
    return this.userShulkersService.pullShulker(username, shulkerId)
  }

  @Delete('/:shulkerId/:username')
  @HttpCode(200)
  async deleteShulker(
    @Param() { shulkerId, username }: DeleteShulkerParamDto,
  ): Promise<void> {
    await this.userShulkersService.deleteShulker(username, shulkerId)
  }
}
