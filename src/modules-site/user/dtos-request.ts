import { ApiProperty } from '@nestjs/swagger'
import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { VipEnum } from 'src/shared/enums'

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

export class GetShulkerItemsParamDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1 })
  shulkerId: number
}

export class ByeVipBodyDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(VipEnum)
  vip: VipEnum
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
  @IsString()
  vip: VipEnum

  @IsNotEmpty()
  @IsNumber()
  advancements: string
}

export class GetAdvancementsParamDto {
  @IsNotEmpty()
  @IsString()
  username: string
}
