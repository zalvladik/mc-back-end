import { ApiProperty } from '@nestjs/swagger'

export class GetMoneyToUserInventoryResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export class AddMoneyToUserInventoryResponseDto {
  @ApiProperty({ example: 50 })
  moneyBefore: number

  @ApiProperty({ example: 100 })
  moneyAfter: number
}

export class PullItemsFromInventoryResponseDto {
  @ApiProperty({
    example: [
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
      'rdvb2ddDtMAAZSXRlbVNAYmVyhqyVHQuU4IsCAAB4cAAADnR0AAZSQUJCSVQ...',
    ],
  })
  data: string[]
}
