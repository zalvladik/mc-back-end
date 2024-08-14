import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { ppEffects, ppStyles } from 'src/shared/constants'

export class AddPpEffectsQueryDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(ppStyles)
  style: string

  @IsString()
  @IsNotEmpty()
  @IsIn(ppEffects)
  effect: string
}

export class DeletePpEffectsQueryDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string
}
