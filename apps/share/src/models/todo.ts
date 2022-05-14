import { Base } from './base'

export enum TodoCategorization {
  URGENT = 'Urgent',
  IMPORTANT = 'Important',
}

export interface Todo extends Base {
  title: string | null
  content: string
  categorization: TodoCategorization[]
  deadline: Date | null
}
