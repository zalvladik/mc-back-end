import { ApiProperty } from '@nestjs/swagger'
import { VipEnum } from 'src/shared/enums'

export class LogoutBodyDto {
  @ApiProperty({ example: 31321 })
  userID: number
}

export class AuthUser {
  @ApiProperty({ example: 5 })
  id: number

  @ApiProperty({ example: 'France' })
  username: string

  @ApiProperty({ example: 100 })
  money: number

  @ApiProperty({ example: 'iron' })
  vip: VipEnum

  @ApiProperty({ example: '2024-07-26 18:19:20' })
  vipExpirationDate: Date | null

  @ApiProperty({ example: 5 })
  advancements: number
}

export class AuthUserResponseDto {
  @ApiProperty({ type: AuthUser })
  user: AuthUser

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken: string
}
