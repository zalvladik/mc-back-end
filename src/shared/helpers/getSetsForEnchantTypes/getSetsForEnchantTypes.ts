import { EnchantMetaTypeEnum, enchantVariables } from 'src/shared/constants'

import type { EnchantsEnum } from 'src/shared/enums'

export const getSetsForEnchantTypes = (
  enchantMetaType: EnchantMetaTypeEnum,
): EnchantsEnum[] => {
  if (enchantMetaType === EnchantMetaTypeEnum.ARMOR) {
    return enchantVariables.armor
  }

  if (enchantMetaType === EnchantMetaTypeEnum.TOOLS_AND_MELEE) {
    return enchantVariables.toolsAndMelee
  }

  return enchantVariables.rangeWeapon
}
