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

  @Post('super_security_key_lmao_buga_buga')
  async addUser(@Body() body: any): Promise<void> {
    this.logget.verbose(body)
    await this.whitelistService.addUser(body)
  }
}
