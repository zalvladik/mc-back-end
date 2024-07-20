import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common'
import { UserDecorator } from 'src/shared/decorators/user.decorator'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { ApiTags } from '@nestjs/swagger'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { AuthService } from 'src/modules-site/auth/services'
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
    @Body() { vip }: ByeVipBodyDto,
    @UserDecorator() { id }: GetUserDto,
  ): Promise<void> {
    await this.userVipService.byeVip({ vip, id })
  }

  @Put()
  async upgradeVip(
    @Body() { vip }: UpgradeVipBodyDto,
    @UserDecorator() { id }: GetUserDto,
  ): Promise<void> {
    await this.userVipService.upgradeVip({ vip, id })
  }
}
