import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class DeleteLotQuaryDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  id: number
}

export class CreateLotBodyDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number
}

export class BuyLotBodyDto {
  @IsNotEmpty()
  @IsNumber()
  lotId: number
}
