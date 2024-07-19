import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { UserDecorator } from 'src/shared/decorators/user.decorator'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { ApiTags } from '@nestjs/swagger'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { AuthService } from 'src/modules-site/auth/services'
import { THIRTY_DAYS } from 'src/shared/constants'
import { Request, Response } from 'express'
import type { AuthUser } from 'src/modules-site/auth/dtos-response'
import { UserVipService } from '../services'
import { ByeVipBodyDto, GetUserDto, UpgradeVipBodyDto } from '../dtos-request'

@Controller('user/vip')
@ApiTags('user/vip')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserVipController {
  constructor(
    private readonly userVipService: UserVipService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async byeVip(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() { vip }: ByeVipBodyDto,
    @UserDecorator() { id, vip: userVip }: GetUserDto,
  ): Promise<AuthUser> {
    await this.userVipService.byeVip({ vip, id, userVip })

    const { refreshToken } = req.cookies

    const updateUserData = await this.authService.refresh(refreshToken)

    res.cookie('refreshToken', updateUserData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    res.setHeader('access-token', updateUserData.accessToken)

    return updateUserData.user
  }

  @Put()
  async upgradeVip(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() { vip }: UpgradeVipBodyDto,
    @UserDecorator() { id }: GetUserDto,
  ): Promise<AuthUser> {
    await this.userVipService.upgradeVip({ vip, id })

    const { refreshToken } = req.cookies

    const updateUserData = await this.authService.refresh(refreshToken)

    res.cookie('refreshToken', updateUserData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    res.setHeader('access-token', updateUserData.accessToken)

    return updateUserData.user
  }
}
