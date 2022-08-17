import { GitHub } from '..'
import { Base } from './base'

export interface Repo extends Base {
  name: string
  data: Record<string, unknown>
  collabs: Record<string, unknown>[]
  synced_at: Date
  outdated: boolean
}

export type GitHubRepo = Repo & {
  data: GitHub.Repository
  collabs: GitHub.Collaborator[]
}
