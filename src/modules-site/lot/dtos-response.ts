import { ApiProperty } from '@nestjs/swagger'
import type { Item } from 'src/entities/item.entity'

export type ItemLotResponseDto = Omit<Item, 'serialized' | 'lot'>

export class CreateLotResponseDto {
  @ApiProperty({ example: 123 })
  id: number

  @ApiProperty({ example: 20 })
  price: number

  @ApiProperty({ example: 'France' })
  realname: string

  item: ItemLotResponseDto
}

export class GetLotsResponseDto {
  @ApiProperty({ example: 123 })
  totalPages: number

  lots: CreateLotResponseDto[]
}

export class DeleteUserLotResponseDto {
  lotId: number

  item: ItemLotResponseDto
}
