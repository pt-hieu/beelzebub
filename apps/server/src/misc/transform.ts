import { Transform } from 'class-transformer'

type OriginalTransfromFunction = Parameters<typeof Transform>[0]
type OriginalTransfromFnParams = Parameters<OriginalTransfromFunction>[0]

export type TransformFnParams<Type, Key = keyof Type> = {
  key: Key
  value: any
  obj: Type
  type: OriginalTransfromFnParams['type']
  options: OriginalTransfromFnParams['options']
}

export type TransformFucntion<T> = (params: TransformFnParams<T>) => any

export const toBoolean: OriginalTransfromFunction = ({ value }) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return false
  }
}
