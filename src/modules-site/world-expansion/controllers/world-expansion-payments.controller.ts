import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import type { WorldExpansionPayments } from 'src/entities/world-expansion-payments.entity'
import { WorldExpansionPaymentsService } from '../services'
import {
  CreateWorldExpansionPaymentsBodyDto,
  GetTopWorldsExpansionPeymentsQueryDto,
} from '../dtos.request'

@Controller('world_expansion/payments')
@ApiTags('world_expansion/payments')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class WorldExpansionPaymentsController {
  constructor(
    private readonly worldExpansionPaymentsService: WorldExpansionPaymentsService,
  ) {}

  @Get()
  @ApiResponse({ status: 200 })
  async getTopWorldsExpansionPeyments(
    @Query() query: GetTopWorldsExpansionPeymentsQueryDto,
  ): Promise<WorldExpansionPayments[]> {
    return this.worldExpansionPaymentsService.getTopWorldsExpansionPeyments(
      query,
    )
  }

  @Post()
  @ApiResponse({
    status: 201,
  })
  async createWorldExpansionPayments(
    @Body() { worldType, money }: CreateWorldExpansionPaymentsBodyDto,
    @UserDecorator() { id }: GetUserDto,
  ): Promise<void> {
    await this.worldExpansionPaymentsService.createWorldsExpansionPeymants({
      worldType,
      money,
      userId: id,
    })
  }
}
