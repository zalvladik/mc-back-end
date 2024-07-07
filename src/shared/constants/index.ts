export const THIRTY_DAYS = 30 * 24 * 60 * 1000

export enum SocketTypes {
  INCREMENT_MONEY,
  DECREMENT_MONEY,
  ADD_ITEMS,
  REMOVE_ITEMS,
  ADD_SHULKER,
  REMOVE_SHULKER,
}

export const itemMeta = {
  id: true,
  amount: true,
  categories: true,
  description: true,
  display_name: true,
  durability: true,
  enchants: true,
  type: true,
}
