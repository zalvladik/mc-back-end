import { ApiProperty } from '@nestjs/swagger'

import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator'

export class PutAdvancementsBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France sword' })
  realname: string

  @IsNotEmpty()
  @IsObject()
  data: object
}

export class GetUserDto {
  @IsEmpty()
  @IsNumber()
  id: number

  @IsEmpty()
  @IsString()
  realname: string

  @IsEmpty()
  @IsString()
  lastlogin: string

  @IsEmpty()
  @IsString()
  userInventory: number

  @IsEmpty()
  @IsString()
  advancements: string
}

export class GetAdvancementsParamDto {
  @IsNotEmpty()
  @IsString()
  realname: string
}
