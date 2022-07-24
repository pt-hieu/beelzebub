import { MessageEvent } from '@nestjs/common'
import { Subject } from 'rxjs'

export class AppSubscription {
  private readonly $emitter = new Subject<MessageEvent>()

  getEmitter() {
    return this.$emitter
  }

  emit(event: string, data: any) {
    this.$emitter.next({ data: JSON.stringify(data), type: event })
  }
}
