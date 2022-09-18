import { Base } from './base.js'

export enum TodoCategorization {
  URGENT = 'URGENT',
  IMPORTANT = 'IMPORTANT',
}

export interface Todo extends Base {
  title: string | null
  content: string
  categorization: TodoCategorization[]
  startTime: Date
  duration: number | null
  weekly: boolean
}
