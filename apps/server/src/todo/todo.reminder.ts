import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { TodoModel } from './todo.model.js'
import { TodoService } from './todo.service.js'

@EventSubscriber()
export class TodoSubscriber implements EntitySubscriberInterface<TodoModel> {
  constructor(connection: Connection, private service: TodoService) {
    connection.subscribers.push(this)
  }

  listenTo(): string | Function {
    return TodoModel
  }

  afterInsert(event: InsertEvent<TodoModel>): void | Promise<any> {
    const { remind } = event.entity
    if (!remind) return

    this.service.scheduleTodo(event.entity)
  }

  afterUpdate({ entity }: UpdateEvent<TodoModel>): void | Promise<any> {
    const todo = entity as TodoModel

    const { remind, id: todoId } = todo
    this.service.cleanUpCron(todoId)

    if (!remind) return
    this.service.scheduleTodo(todo)
  }

  afterRemove(event: RemoveEvent<TodoModel>): void | Promise<any> {
    const { id } = event.entity || {}
    const todoId = id || event.entityId

    if (!todoId) return
    this.service.cleanUpCron(todoId)
  }
}
