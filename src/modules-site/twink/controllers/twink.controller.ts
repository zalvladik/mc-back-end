import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { TwinkService } from '../services'
import { CreateTwinksBodyDto } from '../dtos.request'
import type {
  CreateTwinkResponseDto,
  GetTwinksResponseDto,
} from '../dtos.response'

@Controller('twink')
@ApiTags('twink')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class TwinkController {
  constructor(private readonly twinkService: TwinkService) {}

  @Get()
  async getTwinks(
    @UserDecorator() { username }: GetUserDto,
  ): Promise<GetTwinksResponseDto[]> {
    return this.twinkService.getTwinks(username)
  }

  @Post()
  async createTwinks(
    @Body() { twinkName }: CreateTwinksBodyDto,
    @UserDecorator() { username, id }: GetUserDto,
  ): Promise<CreateTwinkResponseDto> {
    return this.twinkService.createTwinks({
      userId: id,
      mainUserName: username,
      twinkName,
    })
  }
}
