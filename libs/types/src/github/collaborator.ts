import { Permissions } from './utils'

export interface Collaborator {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  type: string
  site_admin: boolean
  permissions: Permissions
  role_name: string
}
