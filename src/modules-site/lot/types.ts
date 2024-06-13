import type { GetUserLotsQuaryDto } from './dtos-request'

export type CreateLotServiceT = {
  userInventoryId: number
  itemId: number
  price: number
}

export type GetUserLotsT = GetUserLotsQuaryDto & { userInventory: number }
