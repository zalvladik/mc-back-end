import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { CategoryEnum, RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import type { Lot } from 'src/entities/lot.entity'

import {
  DeleteLotQuaryDto,
  GetEnchantitemsLotsQuaryDto,
  GetLotsQuaryDto,
} from '../dtos-request'
import { LotService } from '../services'
import type {
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'

@Controller('lot')
@ApiTags('lot')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Get()
  @HttpCode(200)
  async getLots(
    @Query()
    {
      page,
      limit,
      category,
      display_nameOrType,
      didNeedShulkers = false,
      didNeedUserLots = false,
      didPriceToUp = true,
      didNeedIdentical = false,
    }: GetLotsQuaryDto,
    @UserDecorator() { id: userId }: GetUserDto,
  ): Promise<GetLotsResponseDto> {
    const searchFilterParams = {
      page,
      limit,
      didNeedShulkers,
      didNeedUserLots,
      didPriceToUp,
      didNeedIdentical,
    }

    if (category === CategoryEnum.SHULKERS) {
      return this.lotService.getShulkerLots({
        userId,
        display_nameOrType,
        ...searchFilterParams,
      })
    }

    return this.lotService.getLots({
      userId,
      category,
      display_nameOrType,
      ...searchFilterParams,
    })
  }

  @Get('enchant_items')
  @HttpCode(200)
  async getEnchantItems(
    @Query()
    body: GetEnchantitemsLotsQuaryDto,
    @UserDecorator() { id: userId }: GetUserDto,
  ): Promise<GetLotsResponseDto> {
    return this.lotService.getEnchantItems({ userId, ...body })
  }

  @Get('user')
  @HttpCode(200)
  async getUserLots(
    @UserDecorator() { id: userId }: GetUserDto,
  ): Promise<Lot[]> {
    return this.lotService.getUserLots(userId)
  }

  @Delete()
  @HttpCode(200)
  async deleteLot(
    @Query() { id }: DeleteLotQuaryDto,
  ): Promise<DeleteUserLotResponseDto> {
    return this.lotService.deleteLot(id)
  }
}
