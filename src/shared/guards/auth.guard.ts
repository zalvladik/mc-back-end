import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { Response } from 'express'

import { AuthService } from 'src/modules-site/auth/services'

import type { GetUserDto } from 'src/modules-site/user/dtos-request'
import { TokenService } from '../services/token/token.service'
import { getKievTime } from '../helpers/getKievTime'
import { THIRTY_DAYS } from '../constants'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse<Response>()

    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      throw new UnauthorizedException('Token is undefined')
    }

    const accessToken = authorizationHeader.split(' ').at(1)

    try {
      req.user = this.tokenService.validateAccessToken(accessToken)
      const user = await this.authService.getRefreshTokenById(req.user.id)

      if (!user.refreshToken) throw new Error()

      const userData: GetUserDto = req.user

      if (
        userData.vipExpirationDate &&
        getKievTime() > new Date(userData.vipExpirationDate)
      ) {
        await this.authService.resetVip(req.user.id)
        req.user.vip = null
        req.user.vipExpirationDate = null

        const { refreshToken } = req.cookies

        const updateUserData = await this.authService.refresh(refreshToken)

        res.cookie('refreshToken', updateUserData.refreshToken, {
          maxAge: THIRTY_DAYS,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })

        res.setHeader('access-token', updateUserData.accessToken)
        res.setHeader('x-vip-expired', 'true')

        context.switchToHttp().getRequest().response = res
      }
    } catch (error) {
      throw new UnauthorizedException('invalid AccessToken')
    }

    context.switchToHttp().getRequest().user = req.user

    return true
  }
}
