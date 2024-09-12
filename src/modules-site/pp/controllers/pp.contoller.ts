import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
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

import { PpService } from '../services'
import { AddPpEffectsQueryDto, DeletePpEffectsQueryDto } from '../dtos-request'
import type {
  DeletePpParticleResponseDto,
  GetPpParticleResponseDto,
} from '../dtos-response'

@Controller('pp')
@ApiTags('pp')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class PpController {
  constructor(private readonly ppService: PpService) {}

  @Get()
  @HttpCode(200)
  async getPpEffects(
    @UserDecorator() { id }: GetUserDto,
  ): Promise<GetPpParticleResponseDto[]> {
    return this.ppService.getPpParticle(id)
  }

  @Post()
  @HttpCode(200)
  async addPpEffects(
    @Body() { effect, style }: AddPpEffectsQueryDto,
    @UserDecorator() { id, username }: GetUserDto,
  ): Promise<void> {
    await this.ppService.addPpParticle({
      id,
      effect,
      style,
      username,
    })
  }

  @Delete()
  @HttpCode(200)
  async deletePpEffects(
    @Query() { uuid: ppUUID }: DeletePpEffectsQueryDto,
    @UserDecorator() { id, username }: GetUserDto,
  ): Promise<DeletePpParticleResponseDto> {
    return this.ppService.deletePpParticle({ userId: id, ppUUID, username })
  }
}
