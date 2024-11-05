import { Controller, Get, UseGuards } from '@nestjs/common'
import type { Crystal } from 'src/entities/crystal.entity'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { RoleEnum } from 'src/shared/enums'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { UserCrystalsService } from '../services'

@Controller('user/crystals')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class CrystalController {
  constructor(private readonly userCrystalsService: UserCrystalsService) {}

  @Get()
  async getUserCrystals(
    @UserDecorator() { id }: GetUserDto,
  ): Promise<Crystal[]> {
    return this.userCrystalsService.getUserCrystals(id)
  }
}
