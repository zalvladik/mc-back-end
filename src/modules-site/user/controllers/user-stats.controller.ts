import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import type { Advancements } from 'src/entities/advancements.entity'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { UserStatsService } from '../services'

import { GetAdvancementsParamDto, GetUserDto } from '../dtos-request'
import type { GetUserPlaytimeByIdResponseDto } from '../dtos-response'

@Controller('user/stats')
@ApiTags('user/stats')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Get('advancements')
  @HttpCode(200)
  async getAdvancements(): Promise<Advancements[]> {
    return this.userStatsService.getAdvancements()
  }

  @Get('advancements/:userId')
  @HttpCode(200)
  async getUserAdvancementsById(
    @Param() { userId }: GetAdvancementsParamDto,
  ): Promise<Advancements> {
    return this.userStatsService.getUserAdvancementsByUserId(userId)
  }

  @Get('playtime')
  @HttpCode(200)
  async getUserPlaytimeById(
    @UserDecorator() { username }: GetUserDto,
  ): Promise<GetUserPlaytimeByIdResponseDto> {
    return this.userStatsService.getUserPlayTimeByUserName(username)
  }
}
