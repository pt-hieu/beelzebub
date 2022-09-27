import { Event } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { TodoRemindEvent, TriggerRemindEvent } from './todo.event.js'

import { SseService } from '../sse/sse.service.js'

@Injectable()
export class TodoListener {
  constructor(private sseService: SseService) {}

  @OnEvent(Event.TodoEvent.REMIND, { async: true })
  onRemindTodo(event: TodoRemindEvent) {
    if (!(event instanceof TodoRemindEvent)) return

    this.sseService.subscribe(event.data.id, { asReplaySubject: true })

    this.sseService.emit(
      { type: `todo.remind.1`, payload: event.data },
      event.data.id,
    )
  }

  @OnEvent(Event.TodoEvent.TRIGGER_REMIND, { async: true })
  onTriggerRemind(event: TriggerRemindEvent) {
    if (!(event instanceof TriggerRemindEvent)) return

    this.sseService.emit({
      type: `todo.trigger-remind.1`,
      payload: event.todoId,
    })
  }
}
