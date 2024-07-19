import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { UserDecorator } from 'src/shared/decorators/user.decorator'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { ApiTags } from '@nestjs/swagger'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserVipService } from '../services'
import { ByeVipBodyDto, GetUserDto } from '../dtos-request'

@Controller('user/vip')
@ApiTags('user/vip')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserVipController {
  constructor(private readonly userVipService: UserVipService) {}

  @Post()
  async byeVip(
    @Body() { vip }: ByeVipBodyDto,
    @UserDecorator() { id }: GetUserDto,
  ): Promise<any> {
    return this.userVipService.byeVip({ vip, id })
  }
}
