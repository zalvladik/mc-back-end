import type { GetLotsQuaryDto } from './dtos-request'

export type CreateLotItemServiceT = {
  userId: number
  itemId: number
  price: number
  username: string
  lotCount: number
}

export type CreateLotShulkerServiceT = {
  userId: number
  shulkerId: number
  price: number
  username: string
  lotCount: number
}

export type ByeLotItemServiceT = {
  lotId: number
  buyerUserId: number
  itemCount: number
}

export type ByeLotShulkerServiceT = {
  lotId: number
  buyerUserId: number
  shulkerCount: number
}

export type GetItemWithEnchantsService = {
  username: string
  didNeedUserLots?: boolean
  didNeedShulkers?: boolean
} & GetLotsQuaryDto

export type GetShulkerLotsService = {
  username: string
  didNeedUserLots?: boolean
} & GetLotsQuaryDto

export type GetLotsSerivce = {
  username: string
  didNeedUserLots: boolean
  didNeedShulkers: boolean
} & GetLotsQuaryDto
