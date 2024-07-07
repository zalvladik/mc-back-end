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
import type { Shulker } from 'src/entities/shulker.entity'
import { BuyLotShulkerBodyDto, CreateLotShulkerBodyDto } from '../dtos-request'
import { LotShulkerService } from '../services'
import type { CreateLotResponseDto } from '../dtos-response'

@Controller('lot/shulker')
@ApiTags('lot/shulker')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class LotShulkerController {
  constructor(private readonly lotShulkerService: LotShulkerService) {}

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotShulkerBodyDto,
    @UserDecorator() { id, username, countLot }: GetUserDto,
  ): Promise<CreateLotResponseDto> {
    return this.lotShulkerService.createLotShulker({
      ...body,
      username,
      userId: id,
      countLot,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLot(
    @Body() { lotId }: BuyLotShulkerBodyDto,
    @UserDecorator() { id, shulkerCount }: GetUserDto,
  ): Promise<Shulker> {
    return this.lotShulkerService.buyLotShulker({
      lotId,
      buyerUserId: id,
      shulkerCount,
    })
  }
}
