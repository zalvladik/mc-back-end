import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PostUserUuidBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  uuid: string
}

export class GetMoneyFromUserQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string
}

export class GetUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsNumber()
  money: number

  @IsNotEmpty()
  @IsNumber()
  countShulker: number

  @IsNotEmpty()
  @IsNumber()
  countLot: number

  @IsNotEmpty()
  @IsNumber()
  advancements: string
}

export class GetAdvancementsParamDto {
  @IsNotEmpty()
  @IsString()
  username: string
}
