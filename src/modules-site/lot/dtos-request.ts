import type { TransformFnParams } from 'class-transformer'
import { Transform, Type } from 'class-transformer'
import {
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

export class GetLotsQuaryDto {
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

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  display_nameOrType?: string

  @IsOptional()
  @IsString()
  enchants?: string

  @IsOptional()
  @IsString()
  enchantType?: EnchantsTypesEnum

  @IsOptional()
  @IsString()
  didNeedShulkers?: boolean

  @IsOptional()
  @IsString()
  didNeedUserLots?: boolean

  @IsOptional()
  @IsString()
  didMoneyToUp?: boolean

  @IsOptional()
  @IsString()
  didNeedIdentical?: boolean
}
