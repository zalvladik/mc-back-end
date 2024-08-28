import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { GetTradeHistoryQueryDto } from '../dtos-request'
import { LotTradeHistoryService } from '../services/lot-trade-history.service'

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
    @UserDecorator() { id: userId, username }: GetUserDto,
  ): Promise<any> {
    return this.lotTradeHistoryService.getTradeHistory({
      userId,
      username,
      page,
      limit,
      isSeller,
    })
  }
}
