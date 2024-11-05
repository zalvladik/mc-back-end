import { IsEnum, IsNotEmpty } from 'class-validator'
import { CrystalTypeEnum } from 'src/shared/enums'

export class PostOpenLootBoxBodyDto {
  @IsNotEmpty()
  @IsEnum(CrystalTypeEnum, { message: 'Invalid crystal type' })
  type: CrystalTypeEnum
}
