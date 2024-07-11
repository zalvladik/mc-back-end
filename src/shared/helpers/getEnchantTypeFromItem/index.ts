import { EnchantsTypesEnum } from 'src/shared/enums'

export const getEnchantTypeFromItemType = (
  itemType: string,
): EnchantsTypesEnum => {
  if (itemType.includes(EnchantsTypesEnum.HELMET)) {
    return EnchantsTypesEnum.HELMET
  }

  if (itemType.includes(EnchantsTypesEnum.CHESTPLATE)) {
    return EnchantsTypesEnum.CHESTPLATE
  }

  if (itemType.includes(EnchantsTypesEnum.LEGGINGS)) {
    return EnchantsTypesEnum.LEGGINGS
  }

  if (itemType.includes(EnchantsTypesEnum.BOOTS)) {
    return EnchantsTypesEnum.BOOTS
  }

  if (itemType.includes(EnchantsTypesEnum.SWORD)) {
    return EnchantsTypesEnum.SWORD
  }

  if (itemType.includes(EnchantsTypesEnum.AXE)) {
    return EnchantsTypesEnum.AXE
  }

  if (itemType.includes(EnchantsTypesEnum.PICKAXE)) {
    return EnchantsTypesEnum.PICKAXE
  }

  if (itemType.includes(EnchantsTypesEnum.SHOVEL)) {
    return EnchantsTypesEnum.SHOVEL
  }

  if (itemType.includes(EnchantsTypesEnum.HOE)) {
    return EnchantsTypesEnum.HOE
  }

  if (itemType === EnchantsTypesEnum.ELYTRA) {
    return EnchantsTypesEnum.ELYTRA
  }

  if (itemType === EnchantsTypesEnum.TRIDENT) {
    return EnchantsTypesEnum.TRIDENT
  }

  if (itemType === EnchantsTypesEnum.BOW) {
    return EnchantsTypesEnum.BOW
  }

  if (itemType === EnchantsTypesEnum.CROSSBOW) {
    return EnchantsTypesEnum.CROSSBOW
  }

  if (itemType === EnchantsTypesEnum.FISHING_ROD) {
    return EnchantsTypesEnum.FISHING_ROD
  }

  if (itemType === EnchantsTypesEnum.MACE) {
    return EnchantsTypesEnum.MACE
  }

  return null
}
