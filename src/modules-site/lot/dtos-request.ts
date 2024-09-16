import type { TransformFnParams } from 'class-transformer'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { EnchantsTypesEnum } from 'src/shared/enums'

export class DeleteLotQuaryDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  id: number
}

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}

export class GetTradeHistoryQueryDto extends PaginationParams {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isSeller?: boolean
}

export class GetTradeHistoryWithTimeRangeQueryDto {
  @IsNotEmpty()
  @IsString()
  from: string

  @IsNotEmpty()
  @IsString()
  to: string
}

export class LotFilterParams extends PaginationParams {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  didNeedShulkers?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  didNeedUserLots?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  didPriceToUp?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  didNeedIdentical?: boolean
}

export class CreateLotItemBodyDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number
}

export class CreateLotShulkerBodyDto {
  @IsNotEmpty()
  @IsNumber()
  shulkerId: number

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number
}

export class BuyLotItemBodyDto {
  @IsNotEmpty()
  @IsNumber()
  lotId: number
}

export class BuyLotShulkerBodyDto {
  @IsNotEmpty()
  @IsNumber()
  lotId: number
}

export class GetLotsQuaryDto extends LotFilterParams {
  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  display_nameOrType?: string
}

export class GetEnchantitemsLotsQuaryDto extends LotFilterParams {
  @IsNotEmpty()
  @IsString()
  itemType: string

  @IsNotEmpty()
  @IsString()
  enchants: string

  @IsNotEmpty()
  @IsString()
  enchantType: EnchantsTypesEnum
}
