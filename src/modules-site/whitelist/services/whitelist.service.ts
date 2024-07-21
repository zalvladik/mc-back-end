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
    const payComment = data.statementItem?.comment
    const payAmount = data.statementItem.amount
    const { description } = data.statementItem

    if (!payComment && description) {
      const newUserInWhitelist = this.whitelistRepository.create({
        description,
      })

      await this.whitelistRepository.save(newUserInWhitelist)
    }

    if (payComment && payComment.includes('uk-land$') && payAmount >= 200) {
      const username = payComment
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
