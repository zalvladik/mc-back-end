import type { CustomDecorator } from '@nestjs/common'
import { SetMetadata } from '@nestjs/common'
import type { RoleEnum } from '../enums'

export const ROLES_KEY = 'roles'

export const Roles = (...roles: RoleEnum[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles)
