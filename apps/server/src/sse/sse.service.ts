import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'
import { Event } from '@beelzebub/types'
import { EventEmitter2 } from '@nestjs/event-emitter'

type Listener = Extract<ReturnType<EventEmitter2['on']>, { off: () => void }>

@Injectable()
export class SseService {
  private $emitter: EventEmitter2
  private readonly PUBLIC_CHANNEL = 'public'

  constructor() {
    this.$emitter = new EventEmitter2()
  }

  subscribe(channel = this.PUBLIC_CHANNEL) {
    const $sub = new Subject()

    const listener = this.$emitter.on(
      channel,
      function (value) {
        $sub.next(value)
      },
      { objectify: true },
    ) as Listener

    return { $sub, listener }
  }

  emit(data: Event.SSE, channel = this.PUBLIC_CHANNEL) {
    return this.$emitter.emit(channel, { data, type: 'message' })
  }
}
