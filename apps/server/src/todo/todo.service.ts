import { Event } from '@beelzebub/types'

import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'

import { TodoRemindEvent, TriggerRemindEvent } from './todo.event.js'
import { TodoLib } from './todo.lib.js'
import { TodoModel } from './todo.model.js'

import { SchedulerService } from '../misc/scheduler.service.js'

@Injectable()
export class TodoService implements OnApplicationBootstrap {
  #mapper = new Map<string, string>()

  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
    private scheduler: SchedulerService,
    private emitter: EventEmitter2,
  ) {}

  async onApplicationBootstrap() {
    const todoes = await this.findMany()

    todoes.forEach((todo) => {
      this.scheduleTodo(todo)
    })
  }

  public cleanUpCron(todoId: string) {
    const jobId = this.#mapper.get(todoId)

    this.scheduler.removeCron(jobId)
    this.#mapper.delete(todoId)
  }

  public scheduleTodo(todo: TodoModel) {
    const { title, startTime, weekly, remind, id: todoId } = todo

    const jobId = this.scheduler.scheduleCron(
      async () => {
        const remindEvent = new TodoRemindEvent(todo)
        await this.emitter.emitAsync(Event.TodoEvent.REMIND, remindEvent)

        const triggerRemindEvent = new TriggerRemindEvent(todoId)
        this.emitter.emitAsync(
          Event.TodoEvent.TRIGGER_REMIND,
          triggerRemindEvent,
        )

        if (weekly) return
        this.cleanUpCron(todoId)
      },
      {
        name: title,
        cron: TodoLib.parseToCron({ startTime, weekly, remind }),
      },
    )

    this.#mapper.set(todoId, jobId)
  }

  findMany(): Promise<TodoModel[]>
  findMany(from: Date | string, to: Date | string): Promise<TodoModel[]>
  findMany(from?: Date | string, to?: Date | string) {
    return this.repo.find({
      where: [
        {
          ...(from &&
            to && {
              startTime: Between(new Date(from), new Date(to)),
            }),
        },
        { weekly: true },
      ],
      order: {
        startTime: 'asc',
      },
    })
  }

  save(dto: Partial<TodoModel>) {
    return this.repo.save(dto)
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } })
  }

  remove(dto: TodoModel) {
    return this.repo.remove(dto)
  }
}
