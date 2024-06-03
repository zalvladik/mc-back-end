import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class GetItemTicketsCountSlotQueryDto {
  @IsNotEmpty()
  @IsString()
  realname: string

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}
