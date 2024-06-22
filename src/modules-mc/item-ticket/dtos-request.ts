import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

export class GetItemTicketsCountSlotQueryDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}

export class CreateItemTicketBodyDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(27)
  itemIds: number[]
}
