import enchantmentLvl from 'src/shared/helpers/enchantments/enchantmentLvl.json'
import enchantments from 'src/shared/helpers/enchantments/enchantments.json'

type EnchantmentLevel = {
  [key: string]: string
}

type Enchantments = {
  with_lvl: {
    [enchant: string]: string
  }
  without_lvl: {
    [enchant: string]: string
  }
}

const enchantmentLevels: EnchantmentLevel = enchantmentLvl
const enchantmentsData: Enchantments = enchantments

export const enchantmentDescription = (
  enchantmentsArray: string[],
): string[] => {
  const enchants = enchantmentsArray.map(item => {
    const [enchantment, level] = item.split('$')

    const enchantmentName = enchantmentsData.with_lvl[enchantment]

    if (!enchantmentName) return enchantmentsData.without_lvl[enchantment]

    const enchantmentLevel = enchantmentLevels[level]

    return `${enchantmentName} ${enchantmentLevel}`
  })

  return enchants
}
