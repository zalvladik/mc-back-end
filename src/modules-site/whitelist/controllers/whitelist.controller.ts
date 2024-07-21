import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { WhitelistService } from '../services'
import { CheckIsExistUserQueryDto } from '../dtos-request'

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Get()
  async checkIsExistUser(
    @Query() { username }: CheckIsExistUserQueryDto,
  ): Promise<void> {
    await this.whitelistService.checkIsExistUser(username)
  }

  @Post()
  async addUser(@Body() body: any): Promise<void> {
    await this.whitelistService.addUser(body)
  }
}
