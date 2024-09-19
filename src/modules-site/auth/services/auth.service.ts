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
import { McWhitelist } from 'src/entities/mc-whitelist.entity'
import type { AuthUserResponseDto } from '../dtos-response'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(McWhitelist)
    private readonly mcWhitelistRepository: Repository<McWhitelist>,
    private readonly tokenService: TokenService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<AuthUserResponseDto> {
    const userMeta = await this.userRepository.findOne({
      where: { username, isTwink: false },
      relations: ['advancements'],
      select: [
        'id',
        'username',
        'password',
        'role',
        'money',
        'vip',
        'vipExpirationDate',
      ],
    })

    if (!userMeta) throw new NotFoundException(`Гравця ${username} не знайдено`)

    const { password: passwordBD, ...rest } = userMeta

    const isPassEquals = await bcrypt.compare(password, passwordBD)

    if (!isPassEquals) {
      throw new BadRequestException('Неправильний пароль')
    }

    const isExistInDsServer = await this.mcWhitelistRepository.findOne({
      where: { username, isTwink: false, isExistInDsServer: false },
    })

    if (!isExistInDsServer) {
      throw new BadRequestException(
        'Щоб авторизуватись, вам потрібно вернутись на діскорд сервер UK-land',
      )
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

    const isExistInDsServer = await this.mcWhitelistRepository.findOne({
      where: { username, isTwink: false, isExistInDsServer: false },
    })

    if (!isExistInDsServer) {
      throw new BadRequestException(
        'Щоб авторизуватись, вам потрібно вернутись на діскорд сервер UK-land',
      )
    }

    const userMeta = await this.userRepository.findOne({
      where: { username, isTwink: false },
      relations: ['advancements'],
      select: ['id', 'username', 'role', 'money', 'vip', 'vipExpirationDate'],
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
      where: { id, refreshToken, isTwink: false },
      select: ['refreshToken'],
    })
  }

  async getRefreshTokenById(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: { id, isTwink: false },
      select: ['refreshToken'],
    })
  }

  async resetVip(id: number): Promise<void> {
    await this.userRepository.update(id, {
      vip: null,
      vipExpirationDate: null,
    })
  }
}
