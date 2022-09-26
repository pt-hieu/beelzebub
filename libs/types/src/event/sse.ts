import { LinkEvent } from './link.js'
import { RepoEvent } from './repo.js'
import { TodoEvent } from './todo.js'

import { Link } from '../models/link.js'
import { Todo } from '../models/todo.js'

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
  | {
      type: `${TodoEvent.REMIND}.1`
      payload: Todo
    }
