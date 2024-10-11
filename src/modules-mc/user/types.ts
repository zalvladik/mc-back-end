import type { ItemDto, ShulkerDto } from './dtos-request'

export type MoneyStorageDataT = {
  updatedMoney: number
  username: string
}

export type ShulkerPostStorageT = {
  shulkerItems: ItemDto[]
  shulkerData: ShulkerDto
}

export type AddShulkerToUserProps = {
  itemsData: ItemDto[]
  username: string
  cacheId: string
  shulkerData: ShulkerDto
}

export type PutPlaytimeProps = {
  username: string
  afkTime: number
  playTime: number
}
