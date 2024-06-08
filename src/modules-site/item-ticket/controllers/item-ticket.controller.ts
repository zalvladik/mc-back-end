import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import type { ItemTicket } from 'src/entities/item-ticket.entity'
import { RolesGuard } from 'src/shared/guards/roles.guard'
import { RoleEnum } from 'src/shared/enums'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { ItemTicketService } from '../services'

import {
  CreateItemTicketBodyDto,
  DeleteItemTicketBodyDto,
  GetItemsFromTicketParamDto,
  RemoveItemsFromTicketBodyDto,
} from '../dtos-request'

import type {
  CreateItemTicketResponseDto,
  DeleteItemTicketResponseDto,
  GetItemsFromTicketResponseDto,
  RemoveItemsFromTicketResponseDto,
} from '../dtos-response'

@Controller('item_ticket')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
export class ItemTicketController {
  constructor(private readonly itemTicketService: ItemTicketService) {}

  @Get('user_tickets')
  @HttpCode(200)
  async getItemTickets(
    @User() { userInventory }: GetUserDto,
  ): Promise<ItemTicket[]> {
    return this.itemTicketService.getItemTickets(userInventory)
  }

  @Get(':itemTicketId')
  @HttpCode(200)
  async getItemsFromTicket(
    @User() { userInventory }: GetUserDto,
    @Param() { itemTicketId }: GetItemsFromTicketParamDto,
  ): Promise<GetItemsFromTicketResponseDto[]> {
    return this.itemTicketService.getItemsFromTicket(
      userInventory,
      itemTicketId,
    )
  }

  @Put()
  @HttpCode(200)
  async removeItemsFromTicket(
    @User() { userInventory }: GetUserDto,
    @Body() { itemIds }: RemoveItemsFromTicketBodyDto,
  ): Promise<RemoveItemsFromTicketResponseDto[]> {
    return this.itemTicketService.removeItemsFromTicket(itemIds, userInventory)
  }

  @Post()
  @HttpCode(201)
  async createItemToket(
    @User() { userInventory }: GetUserDto,
    @Body() { itemIds }: CreateItemTicketBodyDto,
  ): Promise<CreateItemTicketResponseDto> {
    return this.itemTicketService.createItemTicket(itemIds, userInventory)
  }

  @Delete()
  @HttpCode(200)
  async deleteItemTicket(
    @User() { userInventory }: GetUserDto,
    @Body() { itemIds, itemTicketId }: DeleteItemTicketBodyDto,
  ): Promise<DeleteItemTicketResponseDto[]> {
    return this.itemTicketService.deleteItemTicket({
      itemIds,
      itemTicketId,
      userInventoryId: userInventory,
    })
  }
}
