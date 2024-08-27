import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { BuyLotItemBodyDto, CreateLotItemBodyDto } from '../dtos-request'
import { LotItemService } from '../services'
import type {
  ByeLotItemResponseDto,
  CreateLotResponseDto,
} from '../dtos-response'

@Controller('lot/item')
@ApiTags('lot/item')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
export class LotItemController {
  constructor(private readonly lotItemService: LotItemService) {}

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotItemBodyDto,
    @UserDecorator() { id, username, vip }: GetUserDto,
  ): Promise<CreateLotResponseDto> {
    return this.lotItemService.createLotItem({
      ...body,
      username,
      userId: id,
      vip,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLotItem(
    @Body() { lotId }: BuyLotItemBodyDto,
    @UserDecorator() { id, vip }: GetUserDto,
  ): Promise<ByeLotItemResponseDto> {
    return this.lotItemService.buyLotItem({
      lotId,
      buyerUserId: id,
      vip,
    })
  }
}
