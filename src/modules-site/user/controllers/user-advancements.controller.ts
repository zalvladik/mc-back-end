import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import type { Advancements } from 'src/entities/advancements.entity'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserAdvancementsService } from '../services'

import { GetAdvancementsParamDto } from '../dtos-request'

@Controller('user/advancements')
@ApiTags('user/advancements')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserAdvancementsController {
  constructor(
    private readonly userAdvancementsService: UserAdvancementsService,
  ) {}

  @Get()
  @HttpCode(200)
  async getAdvancements(): Promise<Advancements[]> {
    return this.userAdvancementsService.getAdvancements()
  }

  @Get(':userId')
  @HttpCode(200)
  async getUserAdvancementsById(
    @Param() { userId }: GetAdvancementsParamDto,
  ): Promise<Advancements> {
    return this.userAdvancementsService.getUserAdvancementsByUserId(userId)
  }
}
