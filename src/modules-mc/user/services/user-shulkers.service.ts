import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { User } from 'src/entities/user.entity'
import type { ItemDto } from 'src/modules-mc/user/dtos-request'
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import { SocketService } from 'src/shared/services/socket/socket.service'
import { SocketTypes } from 'src/shared/constants'
import { Item } from 'src/entities/item.entity'
import { Shulker } from 'src/entities/shulker.entity'
import { CacheService } from 'src/shared/services/cache'
import { giveShulkerLocal } from 'src/shared/helpers/giveShulkerLocal'
import { getEnchantTypeFromItemType } from 'src/shared/helpers/getEnchantTypeFromItem'
import { getEnchantMetaType } from 'src/shared/helpers/getEnchantMetaType'
import { EnchantMeta } from 'src/entities/enchant-meta.entity'
import { getVipParams } from 'src/shared/helpers/getVipParams'
import { Lot } from 'src/entities/lot.entity'
import type { PullShulkerResponseDto } from '../dtos-responses'
import type { AddShulkerToUserProps, ShulkerPostStorageT } from '../types'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(EnchantMeta)
    private readonly enchantMetaRepository: Repository<EnchantMeta>,
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

    if (user.isTwink) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    const shulkerCount = await this.shulkerRepository.count({
      where: { user, isTaken: false },
    })

    const { vipShulkerCount } = getVipParams(user.vip)

    if (shulkerCount + 1 > vipShulkerCount) {
      throw new BadRequestException(
        `У вас максимальна кількість шалкерів, ${vipShulkerCount} шлк.`,
      )
    }

    try {
      const items = itemsData.map((item: ItemDto) => {
        const { display_name, categories, description } = itemCategoriesSorter(
          item.type,
        )

        const createdNewItem = this.itemRepository.create({
          ...item,
          user,
          display_name: item.display_name || display_name,
          categories,
        })

        if (description)
          createdNewItem.description = item?.description?.length
            ? item.description
            : description

        if (item.enchants?.length) {
          const enchantType = getEnchantTypeFromItemType(item.type)

          if (enchantType) {
            const enchantMetaType = getEnchantMetaType(enchantType)

            const newEnchantMeta = this.enchantMetaRepository.create({
              enchantLength: item.enchants.length,
              enchantType,
              [enchantMetaType]: item.enchants.join(','),
            })

            createdNewItem.enchantMeta = newEnchantMeta
          }
        }

        return createdNewItem
      })

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
      user,
    })

    await this.shulkerRepository.save(newUserShulker)

    const savedUserShulker = await this.shulkerRepository.findOne({
      where: { id: newUserShulker.id },
    })

    const updatedShulkerItems = shulkerItems.map(item => {
      return { ...item, shulker: savedUserShulker }
    })

    await this.itemRepository.save(updatedShulkerItems)

    this.cacheService.delete(cacheId)

    const savedItemsResult = await this.itemRepository.find({
      where: { shulker: { id: savedUserShulker.id } },
      select: [
        'id',
        'amount',
        'categories',
        'description',
        'display_name',
        'durability',
        'enchants',
        'type',
      ],
      relations: ['lot'],
    })

    this.socketService.updateDataAndNotifyClients({
      username,
      data: { shulker: savedUserShulker, shulkerItems: savedItemsResult },
      type: SocketTypes.ADD_SHULKER,
    })
  }

  async pullShulker(
    username: string,
    shulkerId: number,
  ): Promise<PullShulkerResponseDto> {
    const user = await this.userRepository.findOne({
      where: { username, isTwink: true },
    })

    if (user) {
      throw new BadRequestException('З твіна /trade неможливий')
    }

    const userShulker = await this.shulkerRepository.findOne({
      where: { user: { username }, id: shulkerId, isTaken: false },
      relations: ['items', 'lot'],
    })

    if (!userShulker) {
      throw new NotFoundException('Шалкер з таким id не знайдено')
    }

    const shulkerItems = userShulker.items.map(item => item.serialized)

    return {
      shulkerName: userShulker.display_name,
      shulkerType: userShulker.type,
      shulkerItems,
    }
  }

  async deleteShulker(username: string, shulkerId: number): Promise<void> {
    const currentShulker = await this.shulkerRepository.findOne({
      where: { id: shulkerId },
      relations: ['lot'],
    })

    await this.itemRepository.update(
      { shulker: { id: shulkerId } },
      { isTaken: true },
    )

    await this.shulkerRepository.update(
      { id: shulkerId },
      { isTaken: true, lot: null },
    )

    if (currentShulker.lot) {
      await this.lotRepository.delete(currentShulker.lot.id)
    }

    this.socketService.updateDataAndNotifyClients({
      username,
      data: shulkerId,
      type: SocketTypes.REMOVE_SHULKER,
    })
  }
}
