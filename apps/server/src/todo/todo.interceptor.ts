import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import _ from 'lodash'
import moment from 'moment'
import { Observable, map } from 'rxjs'

import { GetManyTodo } from './todo.input.js'
import { TodoModel } from './todo.model.js'

@Injectable()
export class TodoInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context)

      const method = ctx.getHandler().name
      const resolver = ctx.getClass().name

      const id = ctx.getArgs().id as string

      if (method === 'todoes') {
        return this.#handleQueryTodoes(ctx, next.handle)
      }

      if (method !== 'trigger' && resolver === 'TodoResolver') {
        return this.#handleMutationTodo(id, next.handle)
      }
    }

    return next.handle()
  }

  #handleQueryTodoes(
    ctx: GqlExecutionContext,
    next: () => Observable<TodoModel[]>,
  ): Observable<TodoModel[]> {
    const dto = ctx.getArgs().dto as GetManyTodo
    if (!dto || !dto.from || !dto.to) return next()

    return next().pipe(
      map((res) => res.map((todo) => this.#parseTodoMeta(todo, dto))),
      map((res) => res.flat()),
    )
  }

  #handleMutationTodo(id: string, next: () => Observable<TodoModel>) {
    return next().pipe(map((todo) => this.#parseTodoMeta({ ...todo, id }, {})))
  }

  #parseTodoMeta(todo: TodoModel, dto: GetManyTodo) {
    if (!todo.weekly) return todo

    const [_id, instanceNumber] = todo.id.split('/#')
    if (instanceNumber) {
      const clonedTodo = _.cloneDeep(todo)
      const timestamp = moment(todo.startTime)
        .add(Number(instanceNumber) * 7, 'days')
        .toDate()
        .getTime()
        .toString()

      Object.assign(clonedTodo, clonedTodo.meta[timestamp] || {})
      return clonedTodo
    }

    if (!dto.from || !dto.to) return todo

    const current = moment(todo.startTime)
    const end = moment(dto.to)
    const start = moment(dto.from)

    let index = this.#getTodoIndex(start, current)
    let todoes: TodoModel[] = []

    while (current.isSameOrBefore(end)) {
      const clonedTodo = _.cloneDeep(todo)
      const timestamp = current.toDate().getTime().toString()

      clonedTodo.startTime = current.toDate()
      Object.assign(clonedTodo, clonedTodo.meta[timestamp] || {})

      clonedTodo.id = `${clonedTodo.id}/#${index}`
      clonedTodo.meta = null

      todoes.push(clonedTodo)
      current.add(7, 'days')
      index++
    }

    return todoes
  }

  /** @SideEffect this method modifies `startTime` */
  #getTodoIndex(from: moment.Moment, startTime: moment.Moment): number {
    let index = 0

    while (startTime.isBefore(from)) {
      index++
      startTime.add(7, 'days')
    }

    return index
  }
}
