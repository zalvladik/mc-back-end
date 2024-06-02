import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import type { UserInventory } from 'src/entities/user-inventory.entity'
import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserInventoryService } from '../services'

import { GetUserDto } from '../dtos-request'

@Controller('user_inventory')
@ApiTags('user_inventory')
@UseGuards(AuthGuard)
export class UserInventoryController {
  constructor(private readonly userInventoryService: UserInventoryService) {}

  @Get()
  @HttpCode(200)
  async getUserInventory(
    @User() { userInventory }: GetUserDto,
  ): Promise<UserInventory> {
    return this.userInventoryService.getUserInvenory(userInventory)
  }
}
