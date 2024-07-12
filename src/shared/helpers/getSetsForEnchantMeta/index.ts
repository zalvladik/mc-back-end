import type { EnchantMetaTypeEnum } from 'src/shared/constants'
import { enchantsWithMaxLvl } from 'src/shared/constants'
import { getSetsForEnchantTypes } from '../getSetsForEnchantTypes/getSetsForEnchantTypes'

export const getSetsForEnchantMeta = (
  enchantMetaType: EnchantMetaTypeEnum,
): string[] => {
  const enchants = getSetsForEnchantTypes(enchantMetaType)

  const response = enchants
    .map(enchant => {
      const maxLvL = enchantsWithMaxLvl[enchant]

      if (maxLvL === 1) return `${enchant}$1`

      return Array.from({ length: maxLvL }, () => 'empty').map(
        (_, lvl) => `${enchant}$${lvl + 1}`,
      )
    })
    .flat()

  return response
}
