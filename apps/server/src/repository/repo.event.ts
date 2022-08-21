import { BaseEvent } from '../misc/base.event.js'

export class RepoSyncedEvent extends BaseEvent {
  constructor(props: RepoSyncedEvent) {
    super(props)
  }

  readonly syncDate: Date
}
