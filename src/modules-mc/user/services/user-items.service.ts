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
import type { PullItemsFromUserResponseDto } from '../dtos-responses'

@Injectable()
export class UserItemsService {
  private itemTicketStorage = new Map<number, any>()

  private itemsPostStorage = new Map<string, any>()

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ItemTicket)
    private readonly itemTicketRepository: Repository<ItemTicket>,
    private readonly socketService: SocketService,
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

    if (itemCount + itemsData.length > 27 * user.countShulker) {
      throw new BadRequestException(
        `У вас замало місця на аккаунті, максимально ${user.countShulker} шлк.`,
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

      this.itemsPostStorage.set(itemsStorageId, items)
    } catch (error) {
      throw new BadRequestException('Предмет не знайдено')
    }
  }

  async addItemsToUserConfirm(
    username: string,
    itemsStorageId: string,
  ): Promise<void> {
    const items = this.itemsPostStorage.get(itemsStorageId)

    await this.itemRepository.save(items)

    this.itemsPostStorage.delete(itemsStorageId)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: items,
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

    this.itemTicketStorage.set(itemTicketId, itemTicket)

    return { data }
  }

  async deleteItemsFromUser(
    username: string,
    itemTicketId: number,
  ): Promise<void> {
    const itemTicket = this.itemTicketStorage.get(itemTicketId)

    if (!itemTicket) {
      throw new NotFoundException('Квиток не знайдено у тимчасовому сховищі')
    }

    await this.itemTicketRepository.remove(itemTicket)
    await this.itemRepository.remove(itemTicket.items)

    this.itemTicketStorage.delete(itemTicketId)

    this.socketService.updateDataAndNotifyClients({
      username,
      data: itemTicket,
      type: SocketTypes.REMOVE_ITEMS,
    })
  }
}
