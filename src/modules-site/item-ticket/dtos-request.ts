import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

export class CreateItemTicketBodyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(27)
  itemIds: number[]
}

export class GetItemsFromTicketParamDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}

export class RemoveItemsFromTicketBodyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(27)
  itemIds: number[]
}

export class DeleteItemTicketBodyDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}
