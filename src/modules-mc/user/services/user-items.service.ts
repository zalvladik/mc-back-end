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
import {
  enchantsWithMaxLvl,
  enchantVariables,
  SocketTypes,
} from 'src/shared/constants'
import { CacheService } from 'src/shared/services/cache'
import {
  giveNegativeEnchantsTypes,
  giveOtherEnchantsTypes,
} from 'src/shared/helpers/getSetsForEnchantTypes/getSetsForEnchantTypes'

import { getEnchantTypeFromItemType } from 'src/shared/helpers/getEnchantTypeFromItem'
import type { PullItemsFromUserResponseDto } from '../dtos-responses'

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    private readonly socketService: SocketService,
    private readonly cacheService: CacheService,
  ) {}

  async addItemsToUser(
    itemsData: ItemDto[],
    username: string,
    itemsStorageId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { username },
    })

    if (!user) throw new NotFoundException('Гравця не знайдено')

    const itemCount = await this.itemRepository.count({
      where: { user },
    })

    if (itemCount + itemsData.length > user.itemCount) {
      throw new BadRequestException(
        `У вас замало місця на аккаунті, максимально ${user.itemCount} шт.`,
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

          const enchants = Object.entries(enchantsWithMaxLvl)
            .map(([key, value]) => {
              if (value === 1) return key

              return Array.from({ length: value }).map(
                lvl => `${key}$${lvl}${1}`,
              )
            })
            .flat()

          console.log({ length: enchants.length, enchants })

          return result
        },
      )

      this.cacheService.set(itemsStorageId, items)
    } catch (error) {
      throw new BadRequestException('Предмет не знайдено')
    }
  }

  async addItemsToUserConfirm(
    username: string,
    itemsStorageId: string,
  ): Promise<void> {
    const items = this.cacheService.get<Item[]>(itemsStorageId)

    await this.itemRepository.save(items)

    this.cacheService.delete(itemsStorageId)

    const updatedData = items.map(({ serialized, user, ...rest }) => rest)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: updatedData,
      type: SocketTypes.ADD_ITEMS,
    })
  }

  async pullItemsFromUser(
    itemTicketId: number,
  ): Promise<PullItemsFromUserResponseDto> {
    const itemTicket = await this.itemTicketRepository.findOne({
      where: { id: itemTicketId },
      relations: ['items'],
    })

    if (!itemTicket) throw new NotFoundException('Квиток не знайдено')

    const data = itemTicket.items.map(item => item.serialized)

    this.cacheService.set(itemTicketId, itemTicket)

    return { data }
  }

  async deleteItemsFromUser(
    username: string,
    itemTicketId: number,
  ): Promise<void> {
    const itemTicket = this.cacheService.get<ItemTicket>(itemTicketId)

    await this.itemTicketRepository.remove(itemTicket)
    await this.itemRepository.remove(itemTicket.items)

    this.cacheService.delete(itemTicketId)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: itemTicketId,
      type: SocketTypes.REMOVE_ITEMS,
    })
  }
}
