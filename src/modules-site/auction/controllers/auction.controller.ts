import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import type { Lot } from 'src/entities/lot.entity'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import {
  BuyLotBodyDto,
  CreateLotBodyDto,
  DeleteLotQuaryDto,
} from '../dtos-request'
import { AuctionService } from '../services'

@Controller('auction')
@ApiTags('auction')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @HttpCode(201)
  async createLot(@Body() body: CreateLotBodyDto): Promise<Lot> {
    return this.auctionService.createLot({ ...body, userInventoryId: 2 })
  }

  @Put()
  @HttpCode(201)
  async buyLot(@Body() { lotId }: BuyLotBodyDto): Promise<void> {
    await this.auctionService.buyLot(lotId, 2)
  }

  @Delete()
  @HttpCode(200)
  async deleteLot(@Query() { id }: DeleteLotQuaryDto): Promise<{ id: number }> {
    return this.auctionService.deleteLot(id)
  }
}
