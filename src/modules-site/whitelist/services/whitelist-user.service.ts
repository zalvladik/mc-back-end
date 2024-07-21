import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Whitelist } from 'src/entities/whitelist.entity'
import { Repository } from 'typeorm'

@Injectable()
export class WhitelistUserService {
  constructor(
    @InjectRepository(Whitelist)
    private readonly whitelistRepository: Repository<Whitelist>,
  ) {}

  async checkIsExistUser(username: string): Promise<void> {
    const user = await this.whitelistRepository.findOne({
      where: { user: username },
    })

    if (user) {
      throw new ConflictException(`User '${username}' already exists.`)
    }
  }

  async addUser(username: string): Promise<void> {
    const newUserInWhitelist = this.whitelistRepository.create({
      user: username,
    })

    await this.whitelistRepository.save(newUserInWhitelist)
  }
}
