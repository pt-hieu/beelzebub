import { LinkEvent } from './link.js'
import { RepoEvent } from './repo.js'
import { Link } from '../models/link.js'

export type SSE =
  | {
      type: `${RepoEvent.SYNCED}.1`
      payload: {
        count: number
      }
    }
  | {
      type: `${LinkEvent.CRAWL}.1`
      payload: Link[]
    }
