import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserSkinService } from '../services'

import { GetUserDto } from '../dtos-request'
import type { GetUserSkinRsponseDto } from '../dtos-response'

@Controller('user/skin')
@ApiTags('user/skin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserSkinController {
  constructor(private readonly userSkinService: UserSkinService) {}

  @Get()
  async getSkinByUserName(
    @UserDecorator() { username }: GetUserDto,
  ): Promise<GetUserSkinRsponseDto> {
    return this.userSkinService.getPlayerSkinByUserName(username)
  }
}
