import shulkerJson from 'src/shared/helpers/giveShulkerLocal/shulkers.json'

type ShulkerT = {
  [letter: string]: string
}

const shulkerLocales: ShulkerT = shulkerJson

export const giveShulkerLocal = (value: string): string => {
  return shulkerLocales[value]
}
