import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrderBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string
}

export class CheckIsExistUserQueryDto {
  @IsNotEmpty()
  @IsString()
  username: string
}

export class AddUserToWhiteListBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  transactionId: string
}
