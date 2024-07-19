export const getKievTime = (): Date => {
  const utcDate = new Date()

  const kievOffset = 3 * 60 * 60 * 1000

  const kievDate = new Date(utcDate.getTime() + kievOffset)

  return kievDate
}
