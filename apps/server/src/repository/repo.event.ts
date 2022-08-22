import { BaseEvent } from '../misc/base.event.js'

export class RepoSyncedEvent extends BaseEvent {
  constructor(readonly syncDate: Date) {
    super()
  }
}
