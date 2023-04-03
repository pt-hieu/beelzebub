import { Event } from '@beelzebub/types'

import {
  Injectable,
  InternalServerErrorException,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import _ from 'lodash'
import { Between, FindOptionsWhere, Repository } from 'typeorm'

import { TodoRemindEvent, TriggerRemindEvent } from './todo.event.js'
import { TodoLib } from './todo.lib.js'
import { TodoModel } from './todo.model.js'

import { SchedulerService } from '../misc/scheduler.service.js'
import { asyncTryCatch, tryCatch } from '../misc/try.js'

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
    let queries: FindOptionsWhere<TodoModel>[] = []

    if (from && to) {
      queries.push(
        {
          startTime: Between(new Date(from), new Date(to)),
        },
        { weekly: true },
      )
    }

    if (!queries.length) queries = undefined

    return this.repo.find({
      where: queries,
      order: {
        startTime: 'asc',
      },
    })
  }

  #validateDate(value: any): asserts value is Date {
    if (typeof value !== 'string' && !(value instanceof Date)) {
      throw new Error('Value is not a Date instance')
    }
  }

  save(dto: Partial<TodoModel>): Promise<TodoModel>
  save(target: Date | string, dto: Partial<TodoModel>): Promise<TodoModel>
  async save(
    targetOrDto: Date | string | Partial<TodoModel>,
    dto?: Partial<TodoModel>,
  ) {
    let [result] = await asyncTryCatch(async () => {
      this.#validateDate(targetOrDto)
      if (!dto || !dto.id) return null

      if (typeof targetOrDto === 'string') {
        targetOrDto = new Date(targetOrDto)
      }

      targetOrDto = targetOrDto.getTime().toString()
      const todo = await this.findById(dto.id)

      return this.repo.save({
        ...todo,
        meta: {
          ...todo.meta,
          [targetOrDto]: {
            ...todo.meta[targetOrDto],
            ..._.omit(dto, 'id'),
          },
        },
      })
    })

    if (result) return result

    const [isDate] = tryCatch(() => {
      this.#validateDate(targetOrDto)
      return {}
    })

    if (isDate)
      throw new InternalServerErrorException('[TodoService] - Method: /save/')

    // @ts-expect-error: target type is already validated
    return this.repo.save({ ...targetOrDto, meta: {} })
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } })
  }

  remove(dto: TodoModel) {
    return this.repo.remove(dto)
  }
}
