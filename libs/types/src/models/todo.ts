import { Base } from './base.js'

export enum TodoCategorization {
  URGENT = 'URGENT',
  IMPORTANT = 'IMPORTANT',
}

export enum RemindType {
  FIVE_MINUTES_BEFORE = 'FIVE_MINUTES_BEFORE',
  FIFTEEN_MINUTES_BEFORE = 'FIFTEEN_MINUTES_BEFORE',
  ONE_HOUR_BEFORE = 'ONE_HOUR_BEFORE',
  TWELVE_HOURS_BEFORE = 'TWELVE_HOURS_BEFORE',
}

export interface Todo extends Base {
  title: string | null
  content: string
  categorization: TodoCategorization[]
  startTime: Date
  duration: number | null
  weekly: boolean
  remind: RemindType | null
  meta: Record<string, Omit<Todo, 'meta'>>
}
