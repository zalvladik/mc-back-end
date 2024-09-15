export type ByeItemLotNotificationT = {
  username: string
  message: string
  serialized: string
}

export type ByeShulkerLotNotificationT = {
  username: string
  message: string
  serializedArray: string[]
}

export type HandleAddPPT = { effect: string; style: string; username: string }

export type HandleDeletePPT = { id: number; username: string }