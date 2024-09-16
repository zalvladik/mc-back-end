import { ApiProperty } from '@nestjs/swagger'
import type { Item } from 'src/entities/item.entity'
import type { Shulker } from 'src/entities/shulker.entity'
import type { CategoryEnum } from 'src/shared/enums'

export type ItemLotResponseDto = Omit<Item, 'serialized' | 'lot'>

export type ShulkerLotResponseDto = Omit<Shulker, 'lot'>

export class CreateLotResponseDto {
  @ApiProperty({ example: 123 })
  id: number

  @ApiProperty({ example: 20 })
  price: number

  @ApiProperty({ example: 'France' })
  username: string

  item?: ItemLotResponseDto

  shulker?: ShulkerLotResponseDto
}

export class GetLotsResponseDto {
  @ApiProperty({ example: 123 })
  totalPages: number

  lots: CreateLotResponseDto[]
}

export class BuyLotShulkerResponseDto {
  id: number

  username: string

  type: string

  display_name: string

  categories: CategoryEnum[]
}

export class ByeLotItemResponseDto {
  id: number

  amount: number

  type: string

  durability: string

  display_name: string

  description?: string[]

  enchants?: string[]

  categories: CategoryEnum[]
}

export class DeleteUserLotResponseDto {
  id: number
}

export class GetTradeHistoryWithTimeRangeResponse {
  id: number

  createdAt: Date

  isSeller: boolean

  price: number
}
