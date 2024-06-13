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
import { User } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import {
  BuyLotBodyDto,
  CreateLotBodyDto,
  DeleteLotQuaryDto,
  GetLotsQuaryDto,
  GetUserLotsQuaryDto,
} from '../dtos-request'
import { LotService } from '../services'
import type {
  CreateLotResponseDto,
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
    @Query() payload: GetLotsQuaryDto,
  ): Promise<GetLotsResponseDto> {
    return this.lotService.getLots(payload)
  }

  @Get('user')
  @HttpCode(200)
  async getUserLots(
    @User() { userInventory }: GetUserDto,
    @Query() payload: GetUserLotsQuaryDto,
  ): Promise<GetLotsResponseDto> {
    return this.lotService.getUserLots({ userInventory, ...payload })
  }

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotBodyDto,
    @User() { userInventory }: GetUserDto,
  ): Promise<CreateLotResponseDto> {
    return this.lotService.createLot({
      ...body,
      userInventoryId: userInventory,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLot(@Body() { lotId }: BuyLotBodyDto): Promise<void> {
    await this.lotService.buyLot(lotId, 2)
  }

  @Delete()
  @HttpCode(200)
  async deleteLot(
    @Query() { id }: DeleteLotQuaryDto,
  ): Promise<DeleteUserLotResponseDto> {
    return this.lotService.deleteLot(id)
  }
}
