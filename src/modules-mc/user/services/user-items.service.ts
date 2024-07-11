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
import { itemCategoriesSorter } from 'src/shared/helpers/itemCategoriesSorter'
import { SocketService } from 'src/shared/services/socket/socket.service'
import { SocketTypes } from 'src/shared/constants'
import { CacheService } from 'src/shared/services/cache'

import { EnchantMeta } from 'src/entities/enchant-meta.entity'
import { getEnchantTypeFromItemType } from 'src/shared/helpers/getEnchantTypeFromItem'
import type { PullItemsFromUserResponseDto } from '../dtos-responses'

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(EnchantMeta)
    private readonly enchantMetaRepository: Repository<EnchantMeta>,
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

          return result
        },
      )

      const itemsEnchantMeta = items
        .map(item => {
          if (item.enchants?.length) {
            const enchantType = getEnchantTypeFromItemType(item.type)

            if (enchantType) {
              return this.enchantMetaRepository.create({
                item,
                enchantType,
                [enchantType]: item.enchants,
              })
            }
          }

          return undefined
        })
        .filter(item => item)

      console.log(itemsEnchantMeta[0].boots)

      this.cacheService.set(itemsStorageId, { items, itemsEnchantMeta })
    } catch (error) {
      throw new BadRequestException('Предмет не знайдено')
    }
  }

  async addItemsToUserConfirm(
    username: string,
    itemsStorageId: string,
  ): Promise<void> {
    const { items, itemsEnchantMeta } = this.cacheService.get<{
      items: Item[]
      itemsEnchantMeta: EnchantMeta[]
    }>(itemsStorageId)

    await this.itemRepository.save(items)
    await this.enchantMetaRepository.save(itemsEnchantMeta)

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
