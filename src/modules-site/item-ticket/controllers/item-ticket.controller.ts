import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import type { ItemTicket } from 'src/entities/item-ticket.entity'
import { ItemTicketService } from '../services'

import {
  CreateItemTicketBodyDto,
  GetItemsFromTicketParamDto,
} from '../dtos-request'

import type {
  CreateItemTicketResponseDto,
  GetItemsFromTicketResponseDto,
} from '../dtos-response'

@Controller('item_ticket')
@UseGuards(AuthGuard)
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

  @Post()
  @HttpCode(201)
  async createItemToket(
    @User() { userInventory }: GetUserDto,
    @Body() { itemIds }: CreateItemTicketBodyDto,
  ): Promise<CreateItemTicketResponseDto> {
    return this.itemTicketService.createItemTicket(itemIds, userInventory)
  }
}
