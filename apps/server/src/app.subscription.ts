import { MessageEvent } from '@nestjs/common'
import { Subject } from 'rxjs'
import { Event } from '@beelzebub/types'

export class AppSubscription {
  private readonly $emitter = new Subject<MessageEvent>()

  getEmitter() {
    return this.$emitter
  }

  emit({ payload, type }: Event.SSE) {
    this.$emitter.next({ data: payload, type })
  }
}
