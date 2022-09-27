import { Event, Model } from '@beelzebub/types'

import { Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import moment from 'moment'
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm'

import { TodoRemindEvent, TriggerRemindEvent } from './todo.event.js'
import { TodoModel } from './todo.model.js'

import { SchedulerService } from '../misc/scheduler.service.js'

@EventSubscriber()
export class TodoSubscriber implements EntitySubscriberInterface<TodoModel> {
  #mapper = new Map<string, string>()
  #logger = new Logger(TodoSubscriber.name)

  #remindToMinute: Record<Model.RemindType, number> = {
    FIFTEEN_MINUTES_BEFORE: 15,
    FIVE_MINUTES_BEFORE: 5,
    ONE_HOUR_BEFORE: 0,
    TWELVE_HOURS_BEFORE: 0,
  }

  #remindToHour: Record<Model.RemindType, number> = {
    FIFTEEN_MINUTES_BEFORE: 0,
    FIVE_MINUTES_BEFORE: 0,
    ONE_HOUR_BEFORE: 1,
    TWELVE_HOURS_BEFORE: 12,
  }

  constructor(
    connection: Connection,
    private scheduler: SchedulerService,
    private emitter: EventEmitter2,
  ) {
    connection.subscribers.push(this)
  }

  listenTo(): string | Function {
    return TodoModel
  }

  private parseStartTime2Cron(input: {
    startTime: Date
    weekly: boolean
    remind: Model.RemindType
  }): string {
    const { startTime, weekly, remind } = input

    const remindTime = moment(startTime)
      .subtract(this.#remindToHour[remind], 'hour')
      .subtract(this.#remindToMinute[remind], 'minute')

    this.#logger.debug(remindTime.format('MMMM Do YYYY, h:mm:ss a'))

    const minute = remindTime.get('minute')
    const hour = remindTime.get('hour')

    let day = '*',
      month = '*',
      weekDay = '*'

    if (weekly) {
      weekDay = remindTime.format('ddd')
    } else {
      day = remindTime.get('date') + ''
      month = remindTime.get('month') + 1 + ''
    }

    return `${minute} ${hour} ${day} ${month} ${weekDay}`
  }

  private onTodoRemoved(todoId: string) {
    const jobId = this.#mapper.get(todoId)

    this.scheduler.removeCron(jobId)
    this.#mapper.delete(todoId)
  }

  afterInsert(event: InsertEvent<TodoModel>): void | Promise<any> {
    const { title, startTime, weekly, remind, id: todoId } = event.entity
    if (!remind) return

    const jobId = this.scheduler.scheduleCron(
      async () => {
        const remindEvent = new TodoRemindEvent(event.entity)
        await this.emitter.emitAsync(Event.TodoEvent.REMIND, remindEvent)

        const triggerRemindEvent = new TriggerRemindEvent(todoId)
        this.emitter.emitAsync(
          Event.TodoEvent.TRIGGER_REMIND,
          triggerRemindEvent,
        )

        if (weekly) return
        this.onTodoRemoved(todoId)
      },
      {
        name: title,
        cron: this.parseStartTime2Cron({ startTime, weekly, remind }),
      },
    )

    this.#mapper.set(todoId, jobId)
  }

  afterRemove(event: RemoveEvent<TodoModel>): void | Promise<any> {
    const { id } = event.entity || {}
    const todoId = id || event.entityId

    if (!todoId) return
    this.onTodoRemoved(todoId)
  }
}
