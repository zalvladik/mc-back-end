import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import type { Advancements } from 'src/entities/advancements.entity'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserAdvancementsService } from '../services'

import {
  GetAdvancementsParamDto,
  PutAdvancementsBodyDto,
} from '../dtos-request'

@Controller('user/advancements')
@ApiTags('user/advancements')
@UseGuards(AuthGuard)
export class UserAdvancementsController {
  constructor(
    private readonly userAdvancementsService: UserAdvancementsService,
  ) {}

  @Get()
  @HttpCode(200)
  async getAdvancements(): Promise<Advancements[]> {
    return this.userAdvancementsService.getAdvancements()
  }

  @Get(':realname')
  @HttpCode(200)
  async getUserAdvancementsById(
    @Param() { realname }: GetAdvancementsParamDto,
  ): Promise<Advancements> {
    return this.userAdvancementsService.getUserAdvancementsByRealName(realname)
  }

  @Put()
  @HttpCode(201)
  async putAdvancements(
    @Body() { realname, data }: PutAdvancementsBodyDto,
  ): Promise<void> {
    await this.userAdvancementsService.putAdvancements(realname, data)
  }
}
