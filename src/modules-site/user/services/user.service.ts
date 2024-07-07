import { Injectable } from '@nestjs/common'
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
      select: [
        'id',
        'username',
        'role',
        'money',
        'shulkerCount',
        'lotCount',
        'itemCount',
      ],
    })
  }
}
