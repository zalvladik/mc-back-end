import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import type { WorldExpansion } from 'src/entities/world-expansion.entity'
import { WorldExpansionService } from '../services'
import {
  CreateWorkldExpansionBodyDto,
  GetWorldsExpansionQueryDto,
} from '../dtos.request'

@Controller('world_expansion')
@ApiTags('world_expansion')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class WorldExpansionController {
  constructor(private readonly worldExpansionService: WorldExpansionService) {}

  @Get()
  @ApiResponse({
    status: 200,
  })
  async getWorldsExpansion(
    @Query() { worldType, lvl }: GetWorldsExpansionQueryDto,
  ): Promise<WorldExpansion> {
    return this.worldExpansionService.getWorldsExpansion(worldType, lvl)
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 201,
  })
  async createWorkldExpansion(
    @Body() { worldType, cost }: CreateWorkldExpansionBodyDto,
  ): Promise<WorldExpansion> {
    return this.worldExpansionService.createWorldsExpansion(worldType, cost)
  }
}
