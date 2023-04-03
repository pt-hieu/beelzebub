import { Event } from '@beelzebub/types'

import { NotFoundException, UseInterceptors } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import moment from 'moment'

import { TodoRemindEvent, TriggerRemindEvent } from './todo.event.js'
import {
  CreateTodo,
  GetManyTodo,
  UpdateTodo,
  UpdateTodoOptions,
} from './todo.input.js'
import { TodoInterceptor } from './todo.interceptor.js'
import { TodoModel } from './todo.model.js'
import { ParseTodoUUIDPipe, ParseTodoUUIDPipeReturnType } from './todo.pipe.js'
import { TodoService } from './todo.service.js'

@Resolver(() => TodoModel)
@UseInterceptors(TodoInterceptor)
export class TodoResolver {
  constructor(
    private todoService: TodoService,
    private emitter: EventEmitter2,
  ) {}

  @Query(() => [TodoModel])
  todoes(@Args('dto', { nullable: true }) dto: GetManyTodo) {
    if (dto.from && dto.to) return this.todoService.findMany(dto.from, dto.to)

    return this.todoService.findMany()
  }

  @Mutation(() => TodoModel)
  createTodo(@Args('createTodo') dto: CreateTodo) {
    return this.todoService.save(dto)
  }

  @Mutation(() => TodoModel)
  async updateTodo(
    @Args('id', { type: () => String }, ParseTodoUUIDPipe)
    idObject: any,
    @Args('updateTodo') dto: UpdateTodo,
    @Args('options', { nullable: true }) options: UpdateTodoOptions | null,
  ) {
    const { id, instanceNumber } = idObject as ParseTodoUUIDPipeReturnType

    const todo = await this.todoService.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    if (options && options.updateOnlyTarget && todo.weekly) {
      const targetDate = moment(todo.startTime)
        .add(instanceNumber * 7, 'days')
        .toDate()

      return this.todoService.save(targetDate, { id: todo.id, ...dto })
    }

    return this.todoService.save({ ...todo, ...dto })
  }

  @Mutation(() => TodoModel)
  async deleteTodo(
    @Args('id', { type: () => String }, ParseTodoUUIDPipe) idObject: any,
  ) {
    const { id } = idObject as ParseTodoUUIDPipeReturnType

    const todo = await this.todoService.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    const result = await this.todoService.remove(todo)
    return { ...result, id }
  }

  @Mutation(() => Boolean)
  async trigger() {
    const todo = await this.todoService.findMany().then((r) => r[0])

    const event = new TodoRemindEvent(todo)
    await this.emitter.emitAsync(Event.TodoEvent.REMIND, event)

    const triggerEvent = new TriggerRemindEvent(todo.id)
    this.emitter.emitAsync(Event.TodoEvent.TRIGGER_REMIND, triggerEvent)

    return true
  }
}
