import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RoleEnum } from 'src/shared/enums'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserItemsService } from '../services'

import { GetUserDto } from '../dtos-request'
import type { GetItemsFromUserResponseDto } from '../dtos-response'

@Controller('user/items')
@ApiTags('user/items')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserItemsController {
  constructor(private readonly userItemsService: UserItemsService) {}

  @Get()
  @HttpCode(200)
  async getItemsFrom(
    @UserDecorator() { id }: GetUserDto,
  ): Promise<GetItemsFromUserResponseDto[]> {
    return this.userItemsService.getItemsFromUser(id)
  }
}
