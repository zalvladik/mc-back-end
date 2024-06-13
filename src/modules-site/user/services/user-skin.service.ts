import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { SrPlayerSkin } from 'src/entities/sr/sr-player-skins.entity'
import { SrPlayer } from 'src/entities/sr/sr-players.entity'
import { UserUUID } from 'src/entities/user-uuid.entity'
import type { GetUserSkinRsponseDto } from '../dtos-response'

@Injectable()
export class UserSkinService {
  constructor(
    @InjectRepository(UserUUID)
    private readonly userUUIDRepository: Repository<UserUUID>,
    @InjectRepository(SrPlayer)
    private readonly srPlayerRepository: Repository<SrPlayer>,
    @InjectRepository(SrPlayerSkin)
    private readonly srPlayerSkinRepository: Repository<SrPlayerSkin>,
  ) {}

  async getPlayerSkinByRealName(
    realname: string,
  ): Promise<GetUserSkinRsponseDto> {
    const player = await this.userUUIDRepository.findOne({
      where: { realname },
    })

    if (!player) throw new NotFoundException(`Гравця ${realname} не знайдено`)

    const srPlayer = await this.srPlayerRepository.findOne({
      where: { uuid: player.uuid },
    })

    if (!srPlayer) {
      const srPlayerSkin = await this.srPlayerSkinRepository.findOne({
        where: { last_known_name: realname },
      })

      if (!srPlayerSkin)
        throw new NotFoundException(`Гравця ${realname} не знайдено`)

      return this.decodeBase64ToJson(srPlayerSkin.value)
    }

    const srPlayerSkin = await this.srPlayerSkinRepository.findOne({
      where: { uuid: srPlayer.skin_identifier },
    })

    if (!srPlayerSkin)
      throw new NotFoundException(`Гравця ${realname} не знайдено`)

    return this.decodeBase64ToJson(srPlayerSkin.value)
  }

  decodeBase64ToJson(base64String: string): Promise<GetUserSkinRsponseDto> {
    try {
      const jsonString = Buffer.from(base64String, 'base64').toString('utf8')

      return JSON.parse(jsonString)
    } catch (error) {
      throw new BadRequestException('Invalid Base64 or JSON string')
    }
  }
}
