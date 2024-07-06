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

import { UserShulkersService } from '../services'

import {
  AddShulkerToUserBodyDto,
  AddShulkerToUserConfirmBodyDto,
  //   DeleteShulkerFromUserParamDto,
  //   PullShulkerFromUserParamDto,
} from '../dtos-request'
// import type { PullShulkersFromUserResponseDto } from '../dtos-responses'

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

  //   @Put('/pull/:shulkerTicketId')
  //   @HttpCode(201)
  //   async pullShulkerFromUser(
  //     @Param() { shulkerTicketId }: PullShulkerFromUserParamDto,
  //   ): Promise<PullShulkersFromUserResponseDto> {
  //     return this.userShulkersService.pullShulkerFromUser(shulkerTicketId)
  //   }

  //   @Delete('/delete/:shulkerTicketId/:username')
  //   @HttpCode(200)
  //   async deleteShulkerFromUser(
  //     @Param() { shulkerTicketId, username }: DeleteShulkerFromUserParamDto,
  //   ): Promise<void> {
  //     await this.userShulkersService.deleteShulkerFromUser(
  //       username,
  //       shulkerTicketId,
  //     )
  //   }
}
