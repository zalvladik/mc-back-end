import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import type { WlEnd } from 'src/entities/wl-end.entity'
import { WlEndService } from './wl-end.service'

@Controller('wl-end')
@ApiTags('wl-end')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class WlEndController {
  constructor(private readonly wlEndService: WlEndService) {}

  @Get()
  @ApiResponse({
    status: 200,
  })
  async wlEndList(): Promise<WlEnd[]> {
    return this.wlEndService.wlEndList()
  }

  @Post()
  @ApiResponse({
    status: 201,
  })
  async byeTicket(
    @UserDecorator() { id, username }: GetUserDto,
  ): Promise<WlEnd> {
    return this.wlEndService.byeWlEndTicket(id, username)
  }
}
