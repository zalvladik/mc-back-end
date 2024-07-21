import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'
import type { CreateOrderBodyDto } from '../dtos-request'

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async checkIsExistUser(username: string): Promise<any> {
    const user = await this.whitelistRepository.findOne({
      where: { user: username },
    })

    if (user) {
      throw new ConflictException(
        `Гравець з таким ніком уже існує: '${username}'`,
      )
    }
  }

  async addUser({ data }: CreateOrderBodyDto): Promise<void> {
    const { description = null, comment = null, amount } = data.statementItem

    if (!comment && description) {
      const newUserInWhitelist = this.whitelistRepository.create({
        description,
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }

    if (comment && comment.includes('uk-land$') && amount >= 200) {
      const username = comment
        .trim()
        .replace(/^uk-land\$/, '')
        .replace(/\s+/g, '')

      if (!username) return

      const newUserInWhitelist = this.whitelistRepository.create({
        user: username,
        description,
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }
  }
}
