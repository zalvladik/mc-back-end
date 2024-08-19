import { IsNotEmpty, IsString } from 'class-validator'

export class AddUserToWhiteListBodyDto {
  @IsNotEmpty()
  @IsString()
  nickname: string

  @IsNotEmpty()
  @IsString()
  discordUserId: string
}
