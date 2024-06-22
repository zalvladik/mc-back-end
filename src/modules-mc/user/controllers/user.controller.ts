import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { UserService } from '../services'

import { PostUserUuidBodyDto } from '../dtos-request'

@Controller('mc/user')
@ApiTags('mc/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('userUUID')
  async postUserUUID(
    @Body() { username, uuid }: PostUserUuidBodyDto,
  ): Promise<void> {
    await this.userService.postUserUUID(username, uuid)
  }
}
