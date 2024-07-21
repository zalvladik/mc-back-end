import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import { WhitelistUserService, WhitelistService } from '../services'
import {
  AddUserToWhiteListBodyDto,
  CheckIsExistUserQueryDto,
} from '../dtos-request'

@Controller('whitelist/user')
export class WhitelistUserController {
  constructor(
    private readonly whitelistUserService: WhitelistUserService,
    private readonly whitelistService: WhitelistService,
  ) {}

  @Get()
  async checkIsExistUser(
    @Query() { username }: CheckIsExistUserQueryDto,
  ): Promise<void> {
    await this.whitelistUserService.checkIsExistUser(username)
  }

  @Post()
  async addUser(
    @Body() { username }: AddUserToWhiteListBodyDto,
  ): Promise<void> {
    const isSeccessfulTransaction =
      await this.whitelistService.checkStatus(username)

    if (!isSeccessfulTransaction) {
      throw new NotFoundException('Такої покупки не існує')
    }

    await this.whitelistUserService.addUser(username)
  }
}
