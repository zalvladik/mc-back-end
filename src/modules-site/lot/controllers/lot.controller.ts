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

import { DeleteLotQuaryDto, GetLotsQuaryDto } from '../dtos-request'
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
      category,
      enchants,
      enchantType,
      display_nameOrType,
      didNeedShulkers = true,
      didNeedUserLots = true,
      didPriceToUp = true,
      didNeedIdentical = false,
    }: GetLotsQuaryDto,
    @UserDecorator() { username }: GetUserDto,
  ): Promise<GetLotsResponseDto> {
    const restPayload = {
      didNeedShulkers,
      didNeedUserLots,
      didPriceToUp,
      didNeedIdentical,
    }

    if (category === CategoryEnum.SHULKERS) {
      return this.lotService.getShulkerLots({
        username,
        ...restPayload,
      })
    }

    if (enchants && enchantType && display_nameOrType) {
      return this.lotService.getItemWithEnchants({
        username,
        enchants,
        enchantType,
        display_nameOrType,
        ...restPayload,
      })
    }

    return this.lotService.getLots({
      username,
      category,
      didNeedShulkers,
      didNeedUserLots,
      didPriceToUp,
      didNeedIdentical,
    })
  }

  @Get('user')
  @HttpCode(200)
  async getUserLots(@UserDecorator() { username }: GetUserDto): Promise<Lot[]> {
    return this.lotService.getUserLots(username)
  }

  @Delete()
  @HttpCode(200)
  async deleteLot(
    @Query() { id }: DeleteLotQuaryDto,
  ): Promise<DeleteUserLotResponseDto> {
    return this.lotService.deleteLot(id)
  }
}
