import {
  NotFoundException,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateTodo, UpdateTodo } from './todo.input.js'
import { TodoModel } from './todo.model.js'
import moment from 'moment'
import { TodoService } from './todo.service.js'

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  @Query(() => [TodoModel])
  todoes() {
    return this.todoService.findWithDeadlineAsc()
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
  async extendTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.todoService.findById(id)

    if (!todo) throw new NotFoundException('Todo not found')
    if (todo.extended)
      throw new UnprocessableEntityException('Todo has already been extended')

    return this.todoService.save({
      ...todo,
      deadline: moment(todo.deadline).add('2', 'days').toDate(),
      extended: true,
    })
  }

  @Mutation(() => TodoModel)
  async deleteTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.todoService.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    const result = await this.todoService.remove(todo)
    return { ...result, id }
  }
}
