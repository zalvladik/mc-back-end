export type CreateLotItemServiceT = {
  userId: number
  itemId: number
  price: number
  username: string
  countLot: number
}

export type CreateLotShulkerServiceT = {
  userId: number
  shulkerId: number
  price: number
  username: string
  countLot: number
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
