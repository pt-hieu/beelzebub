import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTodo, UpdateTodo } from './todo.input'
import { TodoModel } from './todo.model'

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
  ) {}

  @Query(() => [TodoModel])
  todoes() {
    return this.repo.find()
  }

  @Mutation(() => TodoModel)
  createTodo(@Args('createTodo') dto: CreateTodo) {
    return this.repo.save(dto)
  }

  @Mutation(() => TodoModel)
  async updateTodo(
    @Args('updateTodo') dto: UpdateTodo,
    @Args('id', ParseUUIDPipe) id: string,
  ) {
    const todo = await this.repo.findOne({ where: { id } })
    if (!todo) throw new NotFoundException('Todo not found')

    return this.repo.save({ ...todo, ...dto })
  }

  @Mutation(() => TodoModel)
  async deleteTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.repo.findOne({ where: { id } })
    if (!todo) throw new NotFoundException('Todo not found')

    return this.repo.remove(todo)
  }
}
