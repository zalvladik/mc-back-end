import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserInventoryMoneyService } from '../services'

import { GetUserDto } from '../dtos-request'

@Controller('user_inventory/money')
@ApiTags('user_inventory/money')
@UseGuards(AuthGuard)
export class UserInventoryMoneyController {
  constructor(
    private readonly userInventoryMoneyService: UserInventoryMoneyService,
  ) {}

  @Get()
  @HttpCode(200)
  async getMoneyFromInventory(
    @User() { userInventory }: GetUserDto,
  ): Promise<{ money: number }> {
    return this.userInventoryMoneyService.getMoneyById(userInventory)
  }
}
