import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from 'src/modules-site/auth/services'

import { TokenService } from '../services/token/token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      throw new UnauthorizedException('Token is undefined')
    }

    const accessToken = authorizationHeader.split(' ').at(1)

    try {
      req.user = this.tokenService.validateAccessToken(accessToken)
      const user = await this.authService.getRefreshTokenById(req.user.id)

      if (!user.refreshToken) throw new Error()
    } catch (error) {
      throw new UnauthorizedException('invalid AccessToken')
    }

    context.switchToHttp().getRequest().user = req.user

    return true
  }
}
