import { ApiProperty } from '@nestjs/swagger'
import type { Item } from 'src/entities/item.entity'
import type { Shulker } from 'src/entities/shulker.entity'

export type ItemLotResponseDto = Omit<Item, 'serialized' | 'lot'>

export type ShulkerLotResponseDto = Omit<Shulker, 'lot'>

export class CreateLotItemResponseDto {
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

  lots: CreateLotItemResponseDto[]
}

export class DeleteUserLotResponseDto {
  id: number
}
