import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/shared/guards/auth.guard'

import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { UserDecorator } from 'src/shared/decorators/user.decorator'
import { GetUserDto } from 'src/modules-site/user/dtos-request'
import type { Item } from 'src/entities/item.entity'
import { BuyLotItemBodyDto, CreateLotItemBodyDto } from '../dtos-request'
import { LotItemService } from '../services'
import type { CreateLotResponseDto } from '../dtos-response'

@Controller('lot/item')
@ApiTags('lot/item')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class LotItemController {
  constructor(private readonly lotItemService: LotItemService) {}

  @Post()
  @HttpCode(201)
  async createLot(
    @Body() body: CreateLotItemBodyDto,
    @UserDecorator() { id, username, countLot }: GetUserDto,
  ): Promise<CreateLotResponseDto> {
    return this.lotItemService.createLot({
      ...body,
      username,
      userId: id,
      countLot,
    })
  }

  @Put()
  @HttpCode(201)
  async buyLot(
    @Body() { lotId }: BuyLotItemBodyDto,
    @UserDecorator() { id, itemCount }: GetUserDto,
  ): Promise<Item> {
    return this.lotItemService.buyLot({
      lotId,
      buyerUserId: id,
      itemCount,
    })
  }
}
