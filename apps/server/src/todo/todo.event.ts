import { Model } from '@beelzebub/types'

export class TodoRemindEvent {
  constructor(public data: Model.Todo) {}
}
