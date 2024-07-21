import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common'
import { WhitelistService } from '../services'
import { CheckIsExistUserQueryDto } from '../dtos-request'

@Controller('whitelist')
export class WhitelistController {
  private logget = new Logger('WhitelistController')

  constructor(private readonly whitelistService: WhitelistService) {}

  @Get()
  async checkIsExistUser(
    @Query() { username }: CheckIsExistUserQueryDto,
  ): Promise<void> {
    await this.whitelistService.checkIsExistUser(username)
  }

  @Post()
  async addUser(@Body() body: any): Promise<void> {
    this.logget.verbose(body)
    await this.whitelistService.addUser(body)
  }
}
