import type { Item } from 'src/entities/item.entity'

export const didExistItemInInventory = (
  items: Item[],
  itemId: number,
): Item | undefined => {
  return items.find(item => item.id === itemId)
}
