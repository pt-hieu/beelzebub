import { Event } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ReplaySubject, Subject } from 'rxjs'

type Listener = Extract<ReturnType<EventEmitter2['on']>, { off: () => void }>

@Injectable()
export class SseService {
  private $emitter: EventEmitter2
  private readonly PUBLIC_CHANNEL = 'public'

  #preparationDict = new Map<
    string,
    { $sub: ReplaySubject<unknown> | Subject<unknown>; listener: Listener }
  >()

  constructor() {
    this.$emitter = new EventEmitter2()
  }

  subscribe(
    channel = this.PUBLIC_CHANNEL,
    options?: { asReplaySubject?: boolean },
  ) {
    let $sub: Subject<unknown> | ReplaySubject<unknown>, listener: Listener

    if (this.#preparationDict.has(channel)) {
      return { $sub: this.#preparationDict.get(channel).$sub }
    }

    if (options?.asReplaySubject) {
      $sub = new ReplaySubject(1)
    } else {
      $sub = new Subject()
    }

    listener = this.$emitter.on(
      channel,
      function (value) {
        $sub.next(value)
      },
      { objectify: true },
    ) as Listener

    this.#preparationDict.set(channel, { $sub, listener })
    return { $sub }
  }

  emit(data: Event.SSE, channel = this.PUBLIC_CHANNEL) {
    return this.$emitter.emit(channel, { data, type: 'message' })
  }

  removeSubscription(channel: string) {
    const { listener, $sub } = this.#preparationDict.get(channel) || {}

    if ($sub instanceof ReplaySubject) {
      this.emit({ type: 'todo.close-reminder.1', payload: channel })
    }

    listener?.off()
    this.#preparationDict.delete(channel)
  }
}
