import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CredentialDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  realname: string

  @IsNotEmpty()
  @IsString()
  @Length(5)
  @ApiProperty({ example: '123456789' })
  password: string
}
