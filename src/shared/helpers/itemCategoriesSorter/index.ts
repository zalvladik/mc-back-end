import { CategoryEnum } from 'src/shared/enums'
import itemCategoriesJson from 'src/shared/helpers/itemCategoriesSorter/itemCategories.json'

type ItemInCategorieT = {
  display_name: string
  categories: CategoryEnum[]
  description?: string[]
}

type ItemCategoriesT = {
  [letter: string]: {
    [itemName: string]: {
      display_name: string
      categories: string[]
      description?: string[]
    }
  }
}

const itemCategories: ItemCategoriesT = itemCategoriesJson

const convertCategories = (categories: string[]): CategoryEnum[] => {
  return categories.map(
    category =>
      CategoryEnum[category.toUpperCase() as keyof typeof CategoryEnum],
  )
}

export const itemCategoriesSorter = (type: string): ItemInCategorieT => {
  const firstLetter = type.charAt(0)
  const categoryLetterGroup = itemCategories[firstLetter]

  if (!categoryLetterGroup || !categoryLetterGroup[type]) {
    throw new Error(`Item '${type}' not found in item categories.`)
  }

  const { display_name, categories, description } = categoryLetterGroup[type]

  return {
    display_name: display_name ?? `${new Date()}`,
    categories: convertCategories(categories),
    description,
  }
}
