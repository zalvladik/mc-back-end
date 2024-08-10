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

    if (comment && comment.includes('uk-land$') && amount >= 9500) {
      const uniCodeUsername = comment
        .trim()
        .replace(/^uk-land\$/, '')
        .replace(/\s+/g, '')

      if (!uniCodeUsername) {
        const newUserInWhitelist = this.whitelistRepository.create({
          time: getKievTime(),
        })

        await this.whitelistRepository.save(newUserInWhitelist)

        return
      }

      const unicodeToString = (unicodeStr: string): string => {
        return unicodeStr.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) =>
          String.fromCharCode(parseInt(p1, 16)),
        )
      }

      const username = unicodeToString(uniCodeUsername)

      const newUserInWhitelist = this.whitelistRepository.create({
        user: username,
        time: getKievTime(),
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }
  }
}
