import { Base } from './base.js'

export interface Link extends Base {
  url: string
  alias: string

  title: string | null
  image: string | null
  description: string | null

  scrapeStatus: 'Done' | 'WIP' | 'Error'
}
