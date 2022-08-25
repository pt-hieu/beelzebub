import { GitHub } from '../index.js'
import { Base } from './base.js'

export interface Repo extends Base {
  name: string
  data: Record<string, unknown>
  collabs: Record<string, unknown>[]
  synced_at: Date
  path: string | null
  outdated: boolean
}

export type GitHubRepo = Repo & {
  data: GitHub.Repository
  collabs: GitHub.Collaborator[]
}
