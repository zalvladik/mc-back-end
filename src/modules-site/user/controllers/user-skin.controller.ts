import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserSkinService } from '../services'

import { GetUserDto } from '../dtos-request'
import type { GetUserSkinRsponseDto } from '../dtos-response'

@Controller('user/skin')
@ApiTags('user/skin')
@UseGuards(AuthGuard)
export class UserSkinController {
  constructor(private readonly userSkinService: UserSkinService) {}

  @Get()
  async getSkinByRealName(
    @User() { realname }: GetUserDto,
  ): Promise<GetUserSkinRsponseDto> {
    return this.userSkinService.getPlayerSkinByRealName(realname)
  }
}
