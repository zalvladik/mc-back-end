import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import type { GetProfileResponseDto } from '../dtos-response'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByID(id: number): Promise<GetProfileResponseDto> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'realname', 'lastlogin', 'role'],
    })
  }

  async getUserById(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) throw new NotFoundException(`Гравця не знайдено`)

    return user
  }

  async getUserByRealname(realname: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { realname } })

    if (!user) throw new NotFoundException(`Гравця ${realname} не знайдено`)

    return user
  }
}
