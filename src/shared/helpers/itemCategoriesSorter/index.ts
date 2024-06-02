import itemCategoriesJson from 'src/shared/helpers/itemCategoriesSorter/itemCategories.json'

type ItemInCategorieT = {
  display_name: string
  categories: string[]
  description?: string[]
}

type ItemCategoriesT = {
  [letter: string]: {
    [itemName: string]: ItemInCategorieT
  }
}

const itemCategories: ItemCategoriesT = itemCategoriesJson

export const itemCategoriesSorter = (type: string): ItemInCategorieT => {
  const firstLetter = type.charAt(0)
  const categoryLetterGroup = itemCategories[firstLetter]

  const { display_name, categories, description } = categoryLetterGroup[type]

  return {
    display_name: display_name ?? `${new Date()}`,
    categories,
    description,
  }
}
