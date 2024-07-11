import { enchantVariables } from 'src/shared/constants'
import { EnchantsEnum, EnchantsTypesEnum } from 'src/shared/enums'

const isArmorType = (enchantType: EnchantsTypesEnum): boolean => {
  return (
    enchantType === EnchantsTypesEnum.HELMET ||
    enchantType === EnchantsTypesEnum.CHESTPLATE ||
    enchantType === EnchantsTypesEnum.LEGGINGS ||
    enchantType === EnchantsTypesEnum.BOOTS
  )
}

const isToolType = (enchantType: EnchantsTypesEnum): boolean => {
  return (
    enchantType === EnchantsTypesEnum.AXE ||
    enchantType === EnchantsTypesEnum.PICKAXE ||
    enchantType === EnchantsTypesEnum.SHOVEL ||
    enchantType === EnchantsTypesEnum.HOE
  )
}

export const giveOtherEnchantsTypes = (
  enchantType: EnchantsTypesEnum,
): EnchantsEnum[] => {
  if (isArmorType(enchantType)) {
    return [...enchantVariables.all, ...enchantVariables.armor]
  }

  if (isToolType(enchantType)) {
    return [...enchantVariables.all, ...enchantVariables.tools]
  }

  if (enchantType === EnchantsTypesEnum.BOW) {
    return [EnchantsEnum.UNBREAKING]
  }

  return [...enchantVariables.all]
}

export const giveNegativeEnchantsTypes = (
  enchantType: EnchantsTypesEnum,
): EnchantsEnum[] => {
  const vanishingCurse = EnchantsEnum.VANISHING_CURSE
  const bindingCurse = EnchantsEnum.BINDING_CURSE

  if (isArmorType(enchantType)) {
    return [bindingCurse, vanishingCurse]
  }

  return [vanishingCurse]
}

export const getSetsForEnchantTypes = (
  enchantType: EnchantsTypesEnum,
): EnchantsEnum[] => [
  ...(enchantVariables[enchantType] ?? []),
  ...giveOtherEnchantsTypes(enchantType),
  ...giveNegativeEnchantsTypes(enchantType),
]
