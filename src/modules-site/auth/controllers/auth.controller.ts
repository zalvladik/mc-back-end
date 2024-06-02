import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request, Response } from 'express'

import { GetUserDto } from 'src/modules-site/user-inventory/dtos-request'
import { THIRTY_DAYS } from 'src/shared/constants/thirty_days'
import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RefreshTokenGuard } from 'src/shared/guards/refresh-token.guard'

import { AuthService } from '../services'

import { CredentialDto } from '../dtos-request'

import { AuthUserResponseDto } from '../dtos-response'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_in')
  @ApiOperation({
    summary: 'Log in (Sign in)',
  })
  @ApiResponse({
    status: 200,
    type: AuthUserResponseDto,
  })
  async login(
    @Body() { realname, password }: CredentialDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const userData = await this.authService.login(realname, password)

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    return userData
  }

  @Post('log_out')
  @ApiOperation({
    summary: 'Log out',
  })
  @ApiResponse({
    status: 204,
  })
  @UseGuards(AuthGuard)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @User() { id }: GetUserDto,
  ): Promise<void> {
    this.authService.logout(id)

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  }

  @Get('refresh_token')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh accessToken',
  })
  @ApiResponse({
    status: 200,
    type: AuthUserResponseDto,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserResponseDto> {
    const { refreshToken } = req.cookies

    const userData = await this.authService.refresh(refreshToken)

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    return userData
  }
}
