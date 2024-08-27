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
import { BuyLotShulkerBodyDto, CreateLotShulkerBodyDto } from '../dtos-request'
import { LotShulkerService } from '../services'
import type {
  BuyLotShulkerResponseDto,
  CreateLotResponseDto,
} from '../dtos-response'

@Controller('lot/shulker')
@ApiTags('lot/shulker')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
export class LotShulkerController {
  constructor(private readonly lotShulkerService: LotShulkerService) {}

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotShulkerBodyDto,
    @UserDecorator() { id, username, vip }: GetUserDto,
  ): Promise<CreateLotResponseDto> {
    return this.lotShulkerService.createLotShulker({
      ...body,
      username,
      userId: id,
      vip,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLotShulker(
    @Body() { lotId }: BuyLotShulkerBodyDto,
    @UserDecorator() { id, vip }: GetUserDto,
  ): Promise<BuyLotShulkerResponseDto> {
    return this.lotShulkerService.buyLotShulker({
      lotId,
      buyerUserId: id,
      vip,
    })
  }
}
