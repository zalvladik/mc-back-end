import { Body, Controller, Get, Logger, Post } from '@nestjs/common'
import { WhitelistService } from '../services'

@Controller('whitelist')
export class WhitelistController {
  private logget = new Logger('WhitelistController')

  constructor(private readonly whitelistService: WhitelistService) {}

  @Get()
  async getUserWhiteList(): Promise<string[]> {
    return this.whitelistService.getUserWhiteList()
  }

  @Post()
  async addUser(@Body() body: any): Promise<void> {
    this.logget.verbose(body)
    await this.whitelistService.addUser(body)
  }
}
