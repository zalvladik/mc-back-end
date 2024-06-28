import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from '../services'

import { RegistrationBodyDto } from '../dtos-request'

@Controller('mc/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({
    summary: 'Registration',
  })
  @ApiResponse({
    status: 201,
  })
  async registration(
    @Body() { username, password, uuid }: RegistrationBodyDto,
  ): Promise<void> {
    if (password.trim().length <= 5) {
      throw new BadRequestException('Пароль закороткий')
    }

    await this.authService.registration(username, password, uuid)
  }
}
