import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import {
  GetTradeHistoryQueryDto,
  GetTradeHistoryWithTimeRangeQueryDto,
} from '../dtos-request'
import { LotTradeHistoryService } from '../services/lot-trade-history.service'
import type { GetTradeHistoryWithTimeRangeResponse } from '../dtos-response'

@Controller('lot/trade_history')
@ApiTags('lot/trade_history')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class LotTradeHistoryController {
  constructor(
    private readonly lotTradeHistoryService: LotTradeHistoryService,
  ) {}

  @Get()
  @HttpCode(200)
  async getTradeHistory(
    @Query() { page, limit, isSeller }: GetTradeHistoryQueryDto,
    @UserDecorator() { id: userId }: GetUserDto,
  ): Promise<any> {
    return this.lotTradeHistoryService.getTradeHistory({
      userId,
      page,
      limit,
      isSeller,
    })
  }

  @Get('price')
  @HttpCode(200)
  async getTradeHistoryWithTimeRange(
    @Query()
    { from, to }: GetTradeHistoryWithTimeRangeQueryDto,
    @UserDecorator() { id: userId }: GetUserDto,
  ): Promise<GetTradeHistoryWithTimeRangeResponse[]> {
    return this.lotTradeHistoryService.getTradeHistoryWithTimeRange({
      userId,
      from,
      to,
    })
  }
}
