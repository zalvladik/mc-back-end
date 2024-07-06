import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { Item } from 'src/entities/item.entity'
import { ItemTicket } from 'src/entities/item-ticket.entity'
import { User } from 'src/entities/user.entity'
import type { ItemDto } from 'src/modules-mc/user/dtos-request'
import { enchantmentDescription } from 'src/shared/helpers/enchantments'
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import { SocketService } from 'src/shared/services/socket/socket.service'
import { SocketTypes } from 'src/shared/constants'
import type { ShulkerItem } from 'src/entities/shulker-item.entity'
import type { Shulker } from 'src/entities/shulker.entity'
import { CacheService } from 'src/shared/services/cache'
import type { PullItemsFromUserResponseDto } from '../dtos-responses'
import type { AddShulkerToUserProps, ShulkerPostStorageT } from '../types'

@Injectable()
export class UserShulkersService {
  constructor(
    @InjectRepository(Item)
    private readonly shulkerItemsRepository: Repository<ShulkerItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly shulkerRepository: Repository<Shulker>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
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

    if (shulkerCount + 1 > user.countShulker) {
      throw new BadRequestException(
        `У вас максимальна кількість шалкерів, ${user.countShulker} шлк.`,
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

      this.cacheService.set(cacheId, {
        shulkerItems: items,
        shulkerData,
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

    const updatedShulkerItems = shulkerItems.map(item => {
      return { ...item, shulker: newUserShulker }
    })

    await this.shulkerItemsRepository.save(updatedShulkerItems)

    this.cacheService.delete(cacheId)

    const updatedData = shulkerItems.map(({ serialized, ...rest }) => rest)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: updatedData,
      type: SocketTypes.ADD_SHULKER,
    })
  }

  // async pullShulkerFromUser(
  //   itemTicketId: number,
  // ): Promise<PullItemsFromUserResponseDto> {
  //   const itemTicket = await this.itemTicketRepository.findOne({
  //     where: { id: itemTicketId },
  //     relations: ['items'],
  //   })

  //   if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

  //   const data = itemTicket.items.map(item => item.serialized)

  //   this.cacheService.set(itemTicketId, itemTicket)

  //   return { data }
  // }

  //   async deleteShulkerFromUser(
  //     username: string,
  //     itemTicketId: number,
  //   ): Promise<void> {
  //     const itemTicket: ItemTicket = this.shulkerTicketStorage.get(itemTicketId)

  //     if (!itemTicket) {
  //       throw new NotFoundException('Квиток не знайдено у тимчасовому сховищі')
  //     }

  //     await this.itemTicketRepository.remove(itemTicket)
  //     await this.shulkerItemRepository.remove(itemTicket.items)

  //     this.shulkerTicketStorage.delete(itemTicketId)

  //     this.socketService.updateDataAndNotifyClients({
  //       username,
  //       data: itemTicketId,
  //       type: SocketTypes.REMOVE_ITEMS,
  //     })
  //   }
}
