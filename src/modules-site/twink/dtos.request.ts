import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTwinksBodyDto {
  @IsNotEmpty()
  @IsString()
  twinkName: string
}
