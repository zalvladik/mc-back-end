import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString } from 'class-validator'

export class RegistrationBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456789' })
  password: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'f42c488e-5b3b-3b98-817b-2526f4673fe1' })
  uuid: string
}
