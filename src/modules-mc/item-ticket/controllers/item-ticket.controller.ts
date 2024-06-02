import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ItemTicketService } from '../services'

import { GetItemTicketsCountSlotQueryDto } from '../dtos-request'

@Controller('mc/item_ticket')
@ApiTags('mc/item_ticket')
export class ItemTicketController {
  constructor(private readonly itemTicketService: ItemTicketService) {}

  @Get('countSlots')
  @HttpCode(200)
  async getItemToketsCountSlots(
    @Query() { realname, itemTicketId }: GetItemTicketsCountSlotQueryDto,
  ): Promise<{ countSlots: number }> {
    return this.itemTicketService.getItemTicketsCountSlots(
      itemTicketId,
      realname,
    )
  }
}
