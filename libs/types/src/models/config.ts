import { Base } from './base.js'

export interface Config extends Base {
  unique: true
  display_name: string
  avatar: string
  github_token: string
}
