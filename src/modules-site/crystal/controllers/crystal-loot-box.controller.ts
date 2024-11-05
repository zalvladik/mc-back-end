import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { RoleEnum } from 'src/shared/enums'
import { AuthGuard } from 'src/shared/guards/auth.guard'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { CrystalLootBoxService } from '../services'
import { PostOpenLootBoxBodyDto } from '../dtos-request'
import type { OpenCrystalLootBoxResponseDto } from '../dtos-response'

@Controller('crystal/loot_box')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class CrystalLootBoxController {
  constructor(private readonly crystalLootBoxService: CrystalLootBoxService) {}

  @Post()
  async openLootBox(
    @UserDecorator() { id }: GetUserDto,
    @Body() { type }: PostOpenLootBoxBodyDto,
  ): Promise<OpenCrystalLootBoxResponseDto> {
    return this.crystalLootBoxService.openCrystalLootBox(id, type)
  }
}
