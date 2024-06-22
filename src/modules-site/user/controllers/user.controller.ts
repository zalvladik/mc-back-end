import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserService } from '../services'

import { GetUserDto } from '../dtos-request'
import type { GetProfileResponseDto } from '../dtos-response'

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(
    @UserDecorator() { id }: GetUserDto,
  ): Promise<GetProfileResponseDto> {
    return this.userService.getByID(id)
  }
}
