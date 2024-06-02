import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from 'src/modules-site/auth/services'

import { TokenService } from '../services/token/token.service'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { refreshToken } = request.cookies

    if (!refreshToken) {
      throw new UnauthorizedException('Token is undefined')
    }

    try {
      const userData = this.tokenService.validateRefreshToken(refreshToken)
      const user = this.authService.getByRefreshToken(userData.id, refreshToken)

      if (!user) throw new Error()
    } catch (error) {
      throw new UnauthorizedException('invalid RefreshToken')
    }

    return true
  }
}
