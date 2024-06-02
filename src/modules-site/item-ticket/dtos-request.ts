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
