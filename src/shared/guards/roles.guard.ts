import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { RoleEnum } from '../enums'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const logger = new Logger('RolesGuard')

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      logger.error(
        'User not found in request. Ensure AuthGuard runs before RolesGuard.',
      )
      throw new UnauthorizedException('User not authenticated')
    }

    return requiredRoles.some(role => user.role?.includes(role))
  }
}
