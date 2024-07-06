import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { RoleEnum } from 'src/shared/enums'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { GetUserDto } from '../dtos-request'
import { UserShulkersService } from '../services'

@Controller('user/shulkers')
@ApiTags('user/shulkers')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class UserShulkersController {
  constructor(private readonly userShulkersService: UserShulkersService) {}

  @Get()
  @HttpCode(200)
  async getUserShulkers(@UserDecorator() { id }: GetUserDto): Promise<any> {
    return this.userShulkersService.getUserShulkers(id)
  }
}
