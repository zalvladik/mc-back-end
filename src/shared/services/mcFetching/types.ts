import type { WorldEnum } from 'src/shared/enums'

export type ByeItemLotNotificationProps = {
  username: string
  message: string
  serialized: string
}

export type ByeShulkerLotNotificationProps = {
  username: string
  message: string
  serializedArray: string[]
}

export type HandleAddPPProps = {
  effect: string
  style: string
  username: string
}

export type HandleDeletePPProps = { id: number; username: string }

export type WorldExansionProps = { worldType: WorldEnum; lvl: number }
