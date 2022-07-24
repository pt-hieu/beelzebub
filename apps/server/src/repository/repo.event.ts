import { BaseEvent } from 'src/misc/base.event'

export class RepoSyncedEvent extends BaseEvent {
  constructor(props: RepoSyncedEvent) {
    super(props)
  }

  readonly syncDate: Date
}
