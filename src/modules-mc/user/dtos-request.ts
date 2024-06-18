import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsObject, IsString } from 'class-validator'

export class PutAdvancementsBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  realname: string

  @IsNotEmpty()
  @IsObject()
  data: object
}

export class PostUserUuidBodyDto {
  @IsNotEmpty()
  @IsString()
  realname: string

  @IsNotEmpty()
  @IsString()
  uuid: string
}
