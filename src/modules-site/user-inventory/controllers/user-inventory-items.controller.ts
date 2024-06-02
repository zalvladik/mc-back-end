import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserInventoryItemsService } from '../services'

import { GetUserDto } from '../dtos-request'
import type { GetItemsFromInventoryResponseDto } from '../dtos-responses'

@Controller('user_inventory/items')
@ApiTags('user_inventory/items')
@UseGuards(AuthGuard)
export class UserInventoryItemsController {
  constructor(
    private readonly userInventoryItemsService: UserInventoryItemsService,
  ) {}

  @Get()
  @HttpCode(200)
  async getItemsFromInventory(
    @User() { userInventory }: GetUserDto,
  ): Promise<GetItemsFromInventoryResponseDto[]> {
    return this.userInventoryItemsService.getItemsFromInventory(userInventory)
  }
}
