import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import { TokenService } from 'src/shared/services/token/token.service'
import type { AuthUserResponseDto } from '../dtos-response'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<AuthUserResponseDto> {
    const userMeta = await this.userRepository.findOne({
      where: { username },
      relations: ['advancements'],
      select: [
        'id',
        'username',
        'password',
        'role',
        'money',
        'countShulker',
        'countLot',
      ],
    })

    if (!userMeta) throw new NotFoundException(`Гравця ${username} не знайдено`)

    const { password: passwordBD, ...rest } = userMeta

    const isPassEquals = await bcrypt.compare(password, passwordBD)

    if (!isPassEquals) {
      throw new BadRequestException('Неправильний пароль')
    }

    const user = {
      ...rest,
      advancements: rest.advancements.id,
    }

    const tokens = this.tokenService.generateTokens(user)

    await this.tokenService.create(user.id, tokens.refreshToken)

    return { ...tokens, user }
  }

  logout(userId: number): void {
    this.tokenService.remove(userId)
  }

  async refresh(oldRefreshToken: string): Promise<AuthUserResponseDto> {
    const userData = this.tokenService.validateRefreshToken(oldRefreshToken)
    const { id, username } = userData

    const userMeta = await this.userRepository.findOne({
      where: { username },
      relations: ['advancements'],
      select: ['id', 'username', 'role', 'money', 'countShulker', 'countLot'],
    })

    if (!userMeta) throw new NotFoundException(`Гравця ${username} не знайдено`)

    const user = {
      ...userMeta,
      advancements: userMeta.advancements.id,
    }

    const tokens = this.tokenService.generateTokens(user)

    await this.tokenService.refresh(id, tokens.refreshToken)

    return { ...tokens, user }
  }

  async getByRefreshToken(id: number, refreshToken: string): Promise<any> {
    return this.userRepository.findOne({
      where: { id, refreshToken },
      select: ['refreshToken'],
    })
  }

  async getRefreshTokenById(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: { id },
      select: ['refreshToken'],
    })
  }
}
