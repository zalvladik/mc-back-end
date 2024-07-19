import { Body } from '@nestjs/common'
import { UserDecorator } from 'src/shared/decorators/user.decorator'

import { ByeVipBodyDto, GetUserDto } from '../dtos-request'
import type { UserVipService } from '../services'

export class UserVipController {
  constructor(private readonly userVipService: UserVipService) {}

  async byeVip(
    @Body() { vip }: ByeVipBodyDto,
    @UserDecorator() { money, id }: GetUserDto,
  ): Promise<any> {
    return this.userVipService.byeVip({ vip, money, id })
  }
}
