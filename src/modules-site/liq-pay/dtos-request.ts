import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrderBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string
}
