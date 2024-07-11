import { EnchantsEnum, EnchantsTypesEnum } from '../enums'

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

export const enchantsWithMaxLvl: { [key: string]: number } = {
  [EnchantsEnum.BANE_OF_ARTHROPODS]: 5,
  [EnchantsEnum.BLAST_PROTECTION]: 4,
  [EnchantsEnum.BREACH]: 4,
  [EnchantsEnum.DENSITY]: 5,
  [EnchantsEnum.DEPTH_STRIDER]: 3,
  [EnchantsEnum.EFFICIENCY]: 5,
  [EnchantsEnum.FEATHER_FALLING]: 4,
  [EnchantsEnum.FIRE_ASPECT]: 2,
  [EnchantsEnum.FIRE_PROTECTION]: 4,
  [EnchantsEnum.FORTUNE]: 3,
  [EnchantsEnum.FROST_WALKER]: 2,
  [EnchantsEnum.IMPALING]: 5,
  [EnchantsEnum.KNOCKBACK]: 2,
  [EnchantsEnum.LOOTING]: 3,
  [EnchantsEnum.LOYALTY]: 3,
  [EnchantsEnum.LUCK_OF_THE_SEA]: 3,
  [EnchantsEnum.LURE]: 3,
  [EnchantsEnum.PIERCING]: 4,
  [EnchantsEnum.POWER]: 5,
  [EnchantsEnum.PROJECTILE_PROTECTION]: 4,
  [EnchantsEnum.PROTECTION]: 4,
  [EnchantsEnum.PUNCH]: 2,
  [EnchantsEnum.QUICK_CHARGE]: 3,
  [EnchantsEnum.RESPIRATION]: 3,
  [EnchantsEnum.RIPTIDE]: 3,
  [EnchantsEnum.SHARPNESS]: 5,
  [EnchantsEnum.SMITE]: 5,
  [EnchantsEnum.SOUL_SPEED]: 3,
  [EnchantsEnum.SWEEPING]: 3,
  [EnchantsEnum.SWIFT_SNEAK]: 3,
  [EnchantsEnum.THORNS]: 3,
  [EnchantsEnum.UNBREAKING]: 3,
  [EnchantsEnum.WIND_BURST]: 3,
  [EnchantsEnum.AQUA_AFFINITY]: 1,
  [EnchantsEnum.BINDING_CURSE]: 1,
  [EnchantsEnum.CHANNELING]: 1,
  [EnchantsEnum.VANISHING_CURSE]: 1,
  [EnchantsEnum.SILK_TOUCH]: 1,
  [EnchantsEnum.MENDING]: 1,
  [EnchantsEnum.MULTISHOT]: 1,
  [EnchantsEnum.INFINITY]: 1,
  [EnchantsEnum.FLAME]: 1,
}

export const enchantVariables: {
  [key in EnchantsTypesEnum | string]: EnchantsEnum[]
} = {
  [EnchantsTypesEnum.HELMET]: [
    EnchantsEnum.AQUA_AFFINITY,
    EnchantsEnum.RESPIRATION,
  ],
  [EnchantsTypesEnum.LEGGINGS]: [EnchantsEnum.SWIFT_SNEAK],
  [EnchantsTypesEnum.BOOTS]: [
    EnchantsEnum.DEPTH_STRIDER,
    EnchantsEnum.FROST_WALKER,
    EnchantsEnum.FEATHER_FALLING,
    EnchantsEnum.SOUL_SPEED,
  ],
  [EnchantsTypesEnum.ELYTRA]: [EnchantsEnum.BINDING_CURSE],
  [EnchantsTypesEnum.SWORD]: [
    EnchantsEnum.BANE_OF_ARTHROPODS,
    EnchantsEnum.SMITE,
    EnchantsEnum.SWEEPING,
    EnchantsEnum.FIRE_ASPECT,
    EnchantsEnum.KNOCKBACK,
    EnchantsEnum.LOOTING,
  ],
  [EnchantsTypesEnum.AXE]: [
    EnchantsEnum.SHARPNESS,
    EnchantsEnum.BANE_OF_ARTHROPODS,
    EnchantsEnum.SMITE,
  ],
  [EnchantsTypesEnum.TRIDENT]: [
    EnchantsEnum.CHANNELING,
    EnchantsEnum.LOYALTY,
    EnchantsEnum.RIPTIDE,
    EnchantsEnum.IMPALING,
  ],
  [EnchantsTypesEnum.BOW]: [
    EnchantsEnum.INFINITY,
    EnchantsEnum.MENDING,
    EnchantsEnum.FLAME,
    EnchantsEnum.POWER,
    EnchantsEnum.PUNCH,
  ],
  [EnchantsTypesEnum.CROSSBOW]: [
    EnchantsEnum.MULTISHOT,
    EnchantsEnum.PIERCING,
    EnchantsEnum.QUICK_CHARGE,
  ],
  [EnchantsTypesEnum.FISHING_ROD]: [
    EnchantsEnum.LUCK_OF_THE_SEA,
    EnchantsEnum.LURE,
  ],
  all: [EnchantsEnum.MENDING, EnchantsEnum.UNBREAKING],
  armor: [
    EnchantsEnum.BLAST_PROTECTION,
    EnchantsEnum.FIRE_PROTECTION,
    EnchantsEnum.PROJECTILE_PROTECTION,
    EnchantsEnum.PROTECTION,
    EnchantsEnum.THORNS,
  ],
  tools: [
    EnchantsEnum.FORTUNE,
    EnchantsEnum.SILK_TOUCH,
    EnchantsEnum.EFFICIENCY,
  ],
}
