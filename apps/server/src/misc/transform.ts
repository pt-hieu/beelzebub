import { Transform } from 'class-transformer'

type TransfromFunction = Parameters<typeof Transform>[0]

export const toBoolean: TransfromFunction = ({ value }) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return false
  }
}
