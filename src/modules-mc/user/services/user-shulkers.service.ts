import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import type { ItemDto } from 'src/modules-mc/user/dtos-request'
import { enchantmentDescription } from 'src/shared/helpers/enchantments'
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import { SocketService } from 'src/shared/services/socket/socket.service'
import { SocketTypes } from 'src/shared/constants'
import { ShulkerItem } from 'src/entities/shulker-item.entity'
import { Shulker } from 'src/entities/shulker.entity'
import { CacheService } from 'src/shared/services/cache'
import { giveShulkerLocal } from 'src/shared/helpers/giveShulkerLocal'
import type { PullShulkerResponseDto } from '../dtos-responses'
import type { AddShulkerToUserProps, ShulkerPostStorageT } from '../types'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(ShulkerItem)
    private readonly shulkerItemsRepository: Repository<ShulkerItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Shulker)
    private readonly shulkerRepository: Repository<Shulker>,
    private readonly socketService: SocketService,
    private readonly cacheService: CacheService,
  ) {}

  async addShulkerToUser({
    shulkerData,
    itemsData,
    cacheId,
    username,
  }: AddShulkerToUserProps): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { username },
    })

    if (!user) throw new NotFoundException('Гравця не знайдено')

    const shulkerCount = await this.shulkerRepository.count({
      where: { user },
    })

    if (shulkerCount + 1 > user.shulkerCount) {
      throw new BadRequestException(
        `У вас максимальна кількість шалкерів, ${user.shulkerCount} шлк.`,
      )
    }

    try {
      const items = itemsData.map(
        (item: ItemDto & { description: string[] | null }) => {
          const { display_name, categories, description } =
            itemCategoriesSorter(item.type)

          let result = {
            ...item,
            user,
            display_name: item.display_name || display_name,
            categories,
          }

          if (description) result = { ...result, description }

          if (item.enchants?.length) {
            const enchants = enchantmentDescription(item.enchants)

            result = { ...result, enchants }
          }

          return result
        },
      )

      const updatedShulkerData = {
        ...shulkerData,
        display_name:
          shulkerData.display_name || giveShulkerLocal(shulkerData.type),
      }

      this.cacheService.set(cacheId, {
        shulkerItems: items,
        shulkerData: updatedShulkerData,
      })
    } catch (error) {
      throw new BadRequestException('Предмет не знайдено')
    }
  }

  async addShulkerToUserConfirm(
    username: string,
    cacheId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { username } })

    const { shulkerItems, shulkerData } =
      this.cacheService.get<ShulkerPostStorageT>(cacheId)

    const newUserShulker = this.shulkerRepository.create({
      ...shulkerData,
      username,
      user,
    })

    await this.shulkerRepository.save(newUserShulker)

    const savedUserShulker = await this.shulkerRepository.findOne({
      where: { id: newUserShulker.id },
    })

    const updatedShulkerItems = shulkerItems.map(item => {
      return { ...item, shulker: savedUserShulker }
    })

    await this.shulkerItemsRepository.save(updatedShulkerItems)

    this.cacheService.delete(cacheId)

    const updatedData = shulkerItems.map(({ serialized, ...rest }) => rest)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: { shulker: savedUserShulker, shulkerItems: updatedData },
      type: SocketTypes.ADD_SHULKER,
    })
  }

  async pullShulker(
    username: string,
    shulkerId: number,
  ): Promise<PullShulkerResponseDto> {
    const userShulker = await this.shulkerRepository.findOne({
      where: { username, id: shulkerId },
      relations: ['shulkerItems'],
    })

    if (!userShulker) {
      throw new NotFoundException('Шалкер з таким id не знайдено')
    }

    const shulkerItems = userShulker.shulkerItems.map(item => item.serialized)

    return {
      shulkerName: userShulker.display_name,
      shulkerType: userShulker.type,
      shulkerItems,
    }
  }

  async deleteShulker(username: string, shulkerId: number): Promise<void> {
    const userShulker = await this.shulkerRepository.findOne({
      where: { id: shulkerId },
      relations: ['shulkerItems'],
    })

    await this.shulkerItemsRepository.remove(userShulker.shulkerItems)
    await this.shulkerRepository.remove(userShulker)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: shulkerId,
      type: SocketTypes.REMOVE_SHULKER,
    })
  }
}
