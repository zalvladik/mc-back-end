import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'

import { GetUserDto } from 'src/modules-site/user/dtos-request'
import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import type { ItemTicket } from 'src/entities/item-ticket.entity'
import { ItemTicketService } from '../services'

import { CreateItemTicketBodyDto } from '../dtos-request'

import type { CreateItemTicketResponseDto } from '../dtos-response'

@Controller('item_ticket')
@UseGuards(AuthGuard)
export class ItemTicketController {
  constructor(private readonly itemTicketService: ItemTicketService) {}

  @Get('user_tickets')
  @HttpCode(200)
  async getItemTokets(
    @User() { userInventory }: GetUserDto,
  ): Promise<ItemTicket[]> {
    return this.itemTicketService.getItemTickets(userInventory)
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
