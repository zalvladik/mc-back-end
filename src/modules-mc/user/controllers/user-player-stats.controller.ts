import { Body, Controller, HttpCode, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserPlayerStatsService } from '../services'

import { PutPlayerStatsBodyDto } from '../dtos-request'

@Controller('mc/user/playerStats')
@ApiTags('mc/user/playerStats')
export class UserPlayerStatsController {
  constructor(
    private readonly userPlayerStatsService: UserPlayerStatsService,
  ) {}

  @Put()
  @HttpCode(200)
  async putPlayerStats(
    @Body() { username, data, afkTime, playTime }: PutPlayerStatsBodyDto,
  ): Promise<void> {
    await this.userPlayerStatsService.putAdvancements(username, data)

    await this.userPlayerStatsService.putPlayTime({
      username,
      afkTime,
      playTime,
    })
  }
}
