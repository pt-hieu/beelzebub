import {
  NotFoundException,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTodo, UpdateTodo } from './todo.input'
import { TodoModel } from './todo.model'
import * as moment from 'moment'

const EXTEND_VALUE = '2 days'

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
  ) {}

  @Query(() => [TodoModel])
  todoes() {
    return this.repo.find({
      order: {
        deadline: 'ASC',
      },
    })
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
  async extendTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.repo.findOne({ where: { id } })

    if (!todo) throw new NotFoundException('Todo not found')
    if (todo.extended)
      throw new UnprocessableEntityException('Todo has already been extended')

    return this.repo.save({
      ...todo,
      deadline: moment(todo.deadline).add(EXTEND_VALUE).toDate(),
      extended: true,
    })
  }

  @Mutation(() => TodoModel)
  async deleteTodo(@Args('id', ParseUUIDPipe) id: string) {
    const todo = await this.repo.findOne({ where: { id } })
    if (!todo) throw new NotFoundException('Todo not found')

    const result = await this.repo.remove(todo)
    return { ...result, id }
  }
}
