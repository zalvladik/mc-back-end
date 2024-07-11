import { enchantsWithMaxLvl } from 'src/shared/constants'
import type { EnchantsTypesEnum } from 'src/shared/enums'
import { getSetsForEnchantTypes } from '../getSetsForEnchantTypes/getSetsForEnchantTypes'

export const getSetsForEnchantMeta = (
  enchantType: EnchantsTypesEnum,
): string[] => {
  const enchants = getSetsForEnchantTypes(enchantType)

  return enchants
    .map(enchant => {
      const maxLvL = enchantsWithMaxLvl[enchant]

      if (maxLvL === 1) return enchant

      return Array.from({ length: maxLvL }, () => 'empty').map(
        (_, lvl) => `${enchant}$${lvl + 1}`,
      )
    })
    .flat()
}
