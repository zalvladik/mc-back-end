import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { User } from 'src/shared/decorators/user.decorator'
import { AuthGuard } from 'src/shared/guards/auth.guard'

import { UserService } from '../services'

import { GetUserDto, PostUserUuidBodyDto } from '../dtos-request'
import type { GetProfileResponseDto } from '../dtos-response'

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@User() { id }: GetUserDto): Promise<GetProfileResponseDto> {
    return this.userService.getByID(id)
  }

  @Post('userUUID')
  async postUserUUID(
    @Body() { realname, uuid }: PostUserUuidBodyDto,
  ): Promise<void> {
    await this.userService.postUserUUID(realname, uuid)
  }
}
