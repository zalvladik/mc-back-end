import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserUUID } from 'src/entities/user-uuid.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserUUID)
    private readonly userUUIDRepository: Repository<UserUUID>,
  ) {}

  async postUserUUID(username: string, uuid: string): Promise<void> {
    const newUserUUID = this.userUUIDRepository.create()

    newUserUUID.username = username
    newUserUUID.uuid = uuid

    await this.userUUIDRepository.save(newUserUUID)
  }
}
