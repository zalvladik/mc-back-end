import { Body, Controller, HttpCode, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserAdvancementsService } from '../services'

import { PutAdvancementsBodyDto } from '../dtos-request'

@Controller('mc/user/advancements')
@ApiTags('mc/user/advancements')
export class UserAdvancementsController {
  constructor(
    private readonly userAdvancementsService: UserAdvancementsService,
  ) {}

  @Put()
  @HttpCode(201)
  async putAdvancements(
    @Body() { username, data }: PutAdvancementsBodyDto,
  ): Promise<void> {
    await this.userAdvancementsService.putAdvancements(username, data)
  }
}
