export type Permissions = {
  admin: boolean
  push: boolean
  pull: boolean
  triage: boolean
  maintain: boolean
}

export type License = {
  key: string
  name: string
  url: string
  spdx_id: string
  node_id: string
  html_url: string
}
