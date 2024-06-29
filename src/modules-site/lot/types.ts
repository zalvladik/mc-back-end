export type CreateLotServiceT = {
  userId: number
  itemId: number
  price: number
  username: string
  countLot: number
}

export type ByeLotServiceT = {
  lotId: number
  byuerUserId: number
  countShulker: number
}
