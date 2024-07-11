import type { EnchantMeta } from 'src/entities/enchant-meta.entity'
import type { ItemDto, ShulkerDto } from './dtos-request'

export type MoneyStorageDataT = {
  updatedMoney: number
  username: string
}

export type ShulkerPostStorageT = {
  shulkerItems: ItemDto[]
  shulkerData: ShulkerDto
  itemsEnchantMeta: EnchantMeta[]
}

export type AddShulkerToUserProps = {
  itemsData: ItemDto[]
  username: string
  cacheId: string
  shulkerData: ShulkerDto
}
