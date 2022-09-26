import { Event } from '@beelzebub/types'

import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TodoRemindEvent } from './todo.event.js'
import { CreateTodo, GetManyTodo, UpdateTodo } from './todo.input.js'
import { TodoModel } from './todo.model.js'
import { TodoService } from './todo.service.js'

@Resolver(() => TodoModel)
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
    @Args('updateTodo') dto: UpdateTodo,
    @Args('id', ParseUUIDPipe) id: string,
  ) {
    const todo = await this.todoService.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    return this.todoService.save({ ...todo, ...dto })
  }

  @Mutation(() => TodoModel)
  async deleteTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.todoService.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    const result = await this.todoService.remove(todo)
    return { ...result, id }
  }

  @Mutation(() => Boolean)
  async trigger() {
    const todo = await this.todoService.findMany().then((r) => r[0])
    const event = new TodoRemindEvent(todo)

    this.emitter.emitAsync(Event.TodoEvent.REMIND, event)

    return true
  }
}
