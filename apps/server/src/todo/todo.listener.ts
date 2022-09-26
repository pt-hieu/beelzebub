import { Event } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { TodoRemindEvent } from './todo.event.js'

import { SseService } from '../sse/sse.service.js'

@Injectable()
export class TodoListener {
  constructor(private sseService: SseService) {}

  @OnEvent(Event.TodoEvent.REMIND, { async: true })
  onRemindTodo(event: TodoRemindEvent) {
    if (!(event instanceof TodoRemindEvent)) return
    this.sseService.emit({ type: `todo.remind.1`, payload: event.data })
  }
}
