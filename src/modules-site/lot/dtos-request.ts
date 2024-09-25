import type { TransformFnParams } from 'class-transformer'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { CategoryEnum, EnchantsTypesEnum } from 'src/shared/enums'

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
  from: Date

  @IsNotEmpty()
  @IsString()
  to: Date
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
  @IsEnum(CategoryEnum, {
    message: 'category must be a valid CategoryEnum value',
  })
  category?: CategoryEnum

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
  @IsEnum(EnchantsTypesEnum, {
    message: 'enchantType must be a valid EnchantsTypesEnum value',
  })
  enchantType: EnchantsTypesEnum
}
