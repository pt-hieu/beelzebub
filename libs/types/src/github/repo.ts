import { License, Permissions } from './utils.js'

export type Repository = {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  html_url: string
  description: string
  fork: boolean
  url: string
  git_url: string
  issue_events_url: string
  ssh_url: string
  homepage: string
  language: any
  forks_count: number
  stargazers_count: number
  watchers_count: number
  size: number
  default_branch: string
  open_issues_count: number
  is_template: boolean
  topics: string[]
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean
  has_downloads: boolean
  archived: boolean
  disabled: boolean
  visibility: string
  pushed_at: string
  created_at: string
  updated_at: string
  permissions: Permissions
  allow_rebase_merge: boolean
  template_repository: any
  temp_clone_token: string
  allow_squash_merge: boolean
  allow_auto_merge: boolean
  delete_branch_on_merge: boolean
  allow_merge_commit: boolean
  subscribers_count: number
  network_count: number
  license: License
  forks: number
  open_issues: number
  watchers: number
}

export interface MutateRepository {
  archived: boolean
  is_template: boolean
  private: boolean
  path: string
}

export interface UpdateRepository extends Partial<MutateRepository> {}
