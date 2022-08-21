import { RepoEvent } from './repo.js'

export type SSE =
  | {
      type: `${RepoEvent.SYNCED}.1`
      payload: {
        count: number
      }
    }
  | {
      type: `Hello world`
      payload: string
    }
