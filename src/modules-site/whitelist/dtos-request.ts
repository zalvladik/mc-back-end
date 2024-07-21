import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrderBodyDto {
  type: string

  data: {
    account: string
    statementItem: {
      id: string
      time: number
      description: string
      comment?: string
      mcc: number
      originalMcc: number
      amount: number
      operationAmount: number
      currencyCode: number
      commissionRate: number
      cashbackAmount: number
      balance: number
      hold: false
    }
  }
}

export class CheckIsExistUserQueryDto {
  @IsNotEmpty()
  @IsString()
  username: string
}

export class AddUserToWhiteListBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string
}
