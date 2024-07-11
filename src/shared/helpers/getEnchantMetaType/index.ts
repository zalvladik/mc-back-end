import { EnchantMetaTypeEnum } from 'src/shared/constants'
import { EnchantsTypesEnum } from 'src/shared/enums'

export const getEnchantMetaType = (
  enchantType: EnchantsTypesEnum,
): EnchantMetaTypeEnum => {
  if (
    enchantType === EnchantsTypesEnum.HELMET ||
    enchantType === EnchantsTypesEnum.CHESTPLATE ||
    enchantType === EnchantsTypesEnum.LEGGINGS ||
    enchantType === EnchantsTypesEnum.BOOTS ||
    enchantType === EnchantsTypesEnum.ELYTRA
  )
    return EnchantMetaTypeEnum.ARMOR

  if (
    enchantType === EnchantsTypesEnum.PICKAXE ||
    enchantType === EnchantsTypesEnum.AXE ||
    enchantType === EnchantsTypesEnum.SHOVEL ||
    enchantType === EnchantsTypesEnum.HOE ||
    enchantType === EnchantsTypesEnum.SWORD ||
    enchantType === EnchantsTypesEnum.FISHING_ROD
  ) {
    return EnchantMetaTypeEnum.TOOLS_AND_MELEE
  }

  if (
    enchantType === EnchantsTypesEnum.BOW ||
    enchantType === EnchantsTypesEnum.CROSSBOW ||
    enchantType === EnchantsTypesEnum.TRIDENT
  ) {
    return EnchantMetaTypeEnum.RANGE_WEAPON
  }

  return null
}
