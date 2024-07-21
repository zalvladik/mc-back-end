import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'
import { getKievTime } from 'src/shared/helpers/getKievTime'
import type { CreateOrderBodyDto } from '../dtos-request'

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async getUserWhiteList(): Promise<string[]> {
    return (await this.whitelistRepository.find({ select: ['user'] })).map(
      item => item.user,
    )
  }

  async addUser({ data }: CreateOrderBodyDto): Promise<void> {
    const { comment = null, amount } = data.statementItem

    if (!comment) {
      const newUserInWhitelist = this.whitelistRepository.create({
        time: getKievTime(),
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }

    if (comment && amount >= 10000) {
      const username = comment.trim().replace(/\s+/g, '')

      if (!username) return

      const newUserInWhitelist = this.whitelistRepository.create({
        user: username,
        time: getKievTime(),
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }
  }
}
