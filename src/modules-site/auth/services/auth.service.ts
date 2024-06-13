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
    realname: string,
    password: string,
  ): Promise<AuthUserResponseDto> {
    const userMeta = await this.userRepository.findOne({
      where: { realname },
      relations: ['userInventory', 'advancements'],
      select: ['id', 'realname', 'lastlogin', 'password', 'role'],
    })

    if (!userMeta) throw new NotFoundException(`${realname} was not found`)

    const { password: passwordBD, ...rest } = userMeta

    const isPassEquals = await bcrypt.compare(password, passwordBD)

    if (!isPassEquals) {
      throw new BadRequestException('Неправильний пароль')
    }

    const user = {
      ...rest,
      advancements: rest.advancements.id,
      userInventory: rest.userInventory.id,
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
    const { id, realname } = userData

    const userMeta = await this.userRepository.findOne({
      where: { realname },
      relations: ['userInventory', 'advancements'],
      select: ['id', 'realname', 'lastlogin', 'role'],
    })

    if (!userMeta) throw new NotFoundException(`Гравця ${realname} не знайдено`)

    const user = {
      ...userMeta,
      advancements: userMeta.advancements.id,
      userInventory: userMeta.userInventory.id,
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
