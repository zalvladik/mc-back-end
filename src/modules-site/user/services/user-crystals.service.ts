import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Crystal } from 'src/entities/crystal.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserCrystalsService {
  constructor(
    @InjectRepository(Crystal)
    private readonly crystalRepository: Repository<Crystal>,
  ) {}

  async getUserCrystals(id: number): Promise<Crystal[]> {
    return this.crystalRepository.find({ where: { user: { id } } })
  }
}
