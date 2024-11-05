import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CrystalLootBox } from 'src/entities/crystal-loot-box.entity'
import { Crystal } from 'src/entities/crystal.entity'
import { User } from 'src/entities/user.entity'
import {
  CustomModelDataPrefixMap,
  CustomModelDataSufixMap,
} from 'src/shared/constants'
import { CrystalItemTypeEnum, type CrystalTypeEnum } from 'src/shared/enums'
import { Repository } from 'typeorm'
import type { OpenCrystalLootBoxResponseDto } from '../dtos-response'

export class CrystalLootBoxService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Crystal)
    private readonly crystalRepository: Repository<Crystal>,
    @InjectRepository(CrystalLootBox)
    private readonly crystalLootBoxRepository: Repository<CrystalLootBox>,
  ) {}

  private getRandomIntInclusive(max: number): number {
    return Math.floor(Math.random() * max)
  }

  async openCrystalLootBox(
    id: number,
    type: CrystalTypeEnum,
  ): Promise<OpenCrystalLootBoxResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } })
    const crystalLootBox = await this.crystalLootBoxRepository.findOne({
      where: { type },
    })

    if (!crystalLootBox) {
      throw new NotFoundException('Current loot box not found')
    }

    user.money = Number(user.money)

    if (user.money < crystalLootBox.price) {
      throw new HttpException('Недостатньо коштів', HttpStatus.PAYMENT_REQUIRED)
    }
    // user.money -= crystalLootBox.price

    crystalLootBox.openCount += 1

    const crystalsFromCategory = Object.entries(CustomModelDataSufixMap[type])

    const prize =
      crystalsFromCategory[
        this.getRandomIntInclusive(crystalsFromCategory.length)
      ]

    const newCrystal = this.crystalRepository.create({
      user,
      type,
      itemType: CrystalItemTypeEnum.TOOLS_AND_MELEE,
      customModelData: CustomModelDataPrefixMap[type] + prize[1],
    })

    await this.crystalRepository.save(newCrystal)
    await this.crystalLootBoxRepository.save(crystalLootBox)

    const { user: userData, ...rest } = newCrystal

    return rest
  }
}
