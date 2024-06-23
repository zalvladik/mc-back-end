import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import * as bcrypt from 'bcrypt'

import { User } from 'src/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(
    username: string,
    password: string,
    uuid: string,
  ): Promise<void> {
    const isExistUser = await this.userRepository.findOne({
      where: { username },
    })

    if (isExistUser) {
      throw new ConflictException(
        `Такий гравець уже зареєстрований: ${username}`,
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = this.userRepository.create({
      uuid,
      username,
      password: hashedPassword,
    })

    await this.userRepository.save(newUser)
  }
}
