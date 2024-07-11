import { enchantsWithMaxLvl } from 'src/shared/constants'

export const getSetsForEnchantMeta = (): string[] => {
  return Object.entries(enchantsWithMaxLvl)
    .map(([key, value]) => {
      if (value === 1) return key

      return Array.from({ length: value }).map(
        (enchant, i) => `${enchant}$${i + 1}`,
      )
    })
    .flat()
}
