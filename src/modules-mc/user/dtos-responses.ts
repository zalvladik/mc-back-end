import { ApiProperty } from '@nestjs/swagger'

export class GetMoneyToUserResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export class AddMoneyToUserResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export class PullItemsFromUserResponseDto {
  @ApiProperty({
    example: [
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
    ],
  })
  data: string[]
}

export class PullShulkerResponseDto {
  shulkerItems: string[]

  shulkerName: string

  shulkerType: string
}
