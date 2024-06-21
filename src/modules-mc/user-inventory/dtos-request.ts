import { ApiProperty } from '@nestjs/swagger'

import type { TransformFnParams } from 'class-transformer'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PullItemsFromInventoryParamDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  itemTicketid: number
}

export class PullMoneyFromUserInventoryBodyDto {
  @IsNotEmpty()
  @IsString()
  realname: string

  @IsNotEmpty()
  @IsNumber()
  money: number
}

export class GetMoneyFromUserInventoryParamDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  realname: string
}

export class AddMoneyToUserInventoryBodyDto {
  @IsNotEmpty()
  @IsString()
  realname: string

  @IsNotEmpty()
  @IsNumber()
  money: number
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
  @ApiProperty({ example: 'Супер класний меч' })
  display_name: string

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

export class AddItemsToUserInventoryBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'France' })
  realname: string

  @IsNotEmpty()
  @ApiProperty({ example: [ItemDto] })
  data: ItemDto[]
}
