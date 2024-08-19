import { Body, Controller, Post } from '@nestjs/common'
import { WhitelistService } from '../services'
import { AddUserToWhiteListBodyDto } from '../dtos-request'

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  async addUser(@Body() body: AddUserToWhiteListBodyDto): Promise<void> {
    await this.whitelistService.addUser(body)
  }
}
