import { Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { WorldEnum } from 'src/shared/enums'

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}

export class GetWorldsExpansionQueryDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(WorldEnum, {
    message: 'worldType must be a valid WorldEnum value',
  })
  worldType: WorldEnum
}

export class CreateWorldExpansionBodyDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(WorldEnum, {
    message: 'worldType must be a valid WorldEnum value',
  })
  worldType: WorldEnum

  @IsNotEmpty()
  @IsNumber()
  cost: number
}

export class CreateWorldExpansionPaymentsBodyDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(WorldEnum, {
    message: 'worldType must be a valid WorldEnum value',
  })
  worldType: WorldEnum

  @IsNotEmpty()
  @IsNumber()
  money: number
}

export class GetTopWorldsExpansionPeymentsQueryDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  worldId: number
}
