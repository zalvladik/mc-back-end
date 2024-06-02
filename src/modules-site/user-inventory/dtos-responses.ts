import { ApiProperty } from '@nestjs/swagger'
import type { Item } from 'src/entities/item.entity'

export class GetMoneyToUserInventoryResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export class AddMoneyToUserInventoryResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export type GetItemsFromInventoryResponseDto = Omit<Item, 'serialized'>
