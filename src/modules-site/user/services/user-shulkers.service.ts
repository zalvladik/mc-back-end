import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Shulker } from 'src/entities/shulker.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(User)
    private readonly userReposetory: Repository<User>,
  ) {}

  async getUserShulkers(id: number): Promise<Shulker[]> {
    const user = await this.userReposetory.findOne({
      where: { id },
      relations: ['shulkers'],
    })

    return user.shulkers
  }
}
