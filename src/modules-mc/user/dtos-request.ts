import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator'

import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import { Optional } from '@nestjs/common'

export class PullItemsFromUserParamDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}

export class DeleteItemsFromUserParamDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketId: number
}

export class PullMoneyFromUserBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsNumber()
  money: number

  @IsNotEmpty()
  @IsString()
  cacheId: string
}

export class PullMoneyFromUserConfirmBodyDto {
  @IsNotEmpty()
  @IsString()
  cacheId: string
}

export class GetMoneyFromUserParamDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string
}

export class AddMoneyToUserBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsNumber()
  money: number

  @IsNotEmpty()
  @IsString()
  cacheId: string
}

export class AddMoneyToUserConfirmBodyDto {
  @IsNotEmpty()
  @IsString()
  cacheId: string
}

export class ItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 64 })
  amount: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'stone' })
  type: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '100 / 120' })
  durability: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Супер класний меч' })
  display_name: string

  @Optional()
  @IsString()
  @ApiProperty({ example: 'Супер класний меч' })
  description?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'rO0ABXNyABpvcmcuYnVra2l0LnV0aWwuaW8uV3JhcHBlcvJQR+zxEm8FAgABTAADbWFwdAAPTGphdmEvdXRpbC9NYXA7eHBzcgA1Y29tLmdvb2dsZS5jb21tb24uY29sbGVjdC5JbW11dGFibGVNYXAkU2VyaWFsaXplZEZvcm0AAAAAAAAAAAIAAkwABGtleXN0ABJMamF2YS9sYW5nL09iamVjdDtMAAZ2YWx1ZXNxAH4ABHhwdXIAE1tMamF2YS5sYW5nLk9iamVjdDuQzlifEHMpbAIAAHhwAAAABHQAAj09dAABdnQABHR5cGV0AARtZXRhdXEAfgAGAAAABHQAHm9yZy5idWtraXQuaW52ZW50b3J5Lkl0ZW1TdGFja3NyABFqYXZhLmxhbmcuSW50ZWdlchLioKT3gYc4AgABSQAFdmFsdWV4cgAQamF2YS5sYW5nLk51bWJlcoaslR0LlOCLAgAAeHAAAA50dAAORU5DSEFOVEVEX0JPT0tzcQB+AABzcQB+AAN1cQB+AAYAAAADcQB+AAh0AAltZXRhLXR5cGV0AA9zdG9yZWQtZW5jaGFudHN1cQB+AAYAAAADdAAISXRlbU1ldGF0AAlFTkNIQU5URURzcgA3Y29tLmdvb2dsZS5jb21tb24uY29sbGVjdC5JbW11dGFibGVCaU1hcCRTZXJpYWxpemVkRm9ybQAAAAAAAAAAAgAAeHEAfgADdXEAfgAGAAAAAXQACkFSUk9XX0ZJUkV1cQB+AAYAAAABc3EAfgAOAAAAAQ==',
  })
  serialized: string

  @IsString()
  @ApiProperty({ example: ['protection$4', 'sharpness$5'] })
  enchants: string[]
}

export class ShulkerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'stone' })
  type: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Супер класний меч' })
  display_name: string
}

export class AddItemsToUserBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsNotEmpty()
  @ApiProperty({ example: [ItemDto] })
  data: ItemDto[]

  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cacheId: string
}

export class AddShulkerToUserBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsNotEmpty()
  @ApiProperty({ example: [ItemDto] })
  itemsData: ItemDto[]

  @IsNotEmpty()
  @ApiProperty({ example: ShulkerDto })
  shulkerData: ShulkerDto

  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cacheId: string
}

export class PullShulkerBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  shulkerId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string
}

export class DeleteShulkerParamDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  @ApiProperty({ example: 1 })
  shulkerId: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string
}

export class AddItemsToUserConfirmBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cacheId: string
}

export class AddShulkerToUserConfirmBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cacheId: string
}

export class PutPlayerStatsBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  username: string

  @IsArray()
  @IsString({ each: true })
  data: string[]

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 99991308 })
  afkTime: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 20857284 })
  playTime: number
}

export class PostUserUuidBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  uuid: string
}
