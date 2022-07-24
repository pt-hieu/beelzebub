import { Base } from './base'

export interface Repo extends Base {
  name: string
  data: Record<string, unknown>
  synced_at: Date
  outdated: boolean
}
