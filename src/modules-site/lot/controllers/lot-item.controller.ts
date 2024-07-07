import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import type { Lot } from 'src/entities/lot.entity'
import type { Item } from 'src/entities/item.entity'
import {
  BuyLotBodyDto,
  CreateLotBodyDto,
  DeleteLotQuaryDto,
  GetLotsQuaryDto,
} from '../dtos-request'
import { LotItemService } from '../services'
import type {
  CreateLotItemResponseDto,
  DeleteUserLotResponseDto,
  GetLotsResponseDto,
} from '../dtos-response'

@Controller('lot/item')
@ApiTags('lot/item')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class LotItemController {
  constructor(private readonly lotItemService: LotItemService) {}

  @Get()
  @HttpCode(200)
  async getLots(
    @Query() payload: GetLotsQuaryDto,
  ): Promise<GetLotsResponseDto> {
    return this.lotItemService.getLots({ ...payload })
  }

  @Get('user')
  @HttpCode(200)
  async getUserLots(@UserDecorator() { id }: GetUserDto): Promise<Lot[]> {
    return this.lotItemService.getUserLots(id)
  }

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotBodyDto,
    @UserDecorator() { id, username, countLot }: GetUserDto,
  ): Promise<CreateLotItemResponseDto> {
    return this.lotItemService.createLot({
      ...body,
      username,
      userId: id,
      countLot,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLot(
    @Body() { lotId }: BuyLotBodyDto,
    @UserDecorator() { id, shulkerCount }: GetUserDto,
  ): Promise<Item> {
    return this.lotItemService.buyLot({
      lotId,
      buyerUserId: id,
      shulkerCount,
    })
  }

  @Delete()
  @HttpCode(200)
  async deleteLot(
    @Query() { id }: DeleteLotQuaryDto,
  ): Promise<DeleteUserLotResponseDto> {
    return this.lotItemService.deleteLot(id)
  }
}
