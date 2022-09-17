import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateTodo, UpdateTodo } from './todo.input.js'
import { TodoModel } from './todo.model.js'
import { TodoService } from './todo.service.js'

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  @Query(() => [TodoModel])
  todoes() {
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
}
