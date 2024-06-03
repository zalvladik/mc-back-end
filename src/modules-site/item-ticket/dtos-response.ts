import type { Item } from 'src/entities/item.entity'

export class CreateItemTicketResponseDto {
  id: number

  items: number[]
}

export type GetItemsFromTicketResponseDto = Omit<Item, 'serialized'>
