import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'

import { TodoModel } from './todo.model.js'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
  ) {}

  findMany(): Promise<TodoModel[]>
  findMany(from: Date | string, to: Date | string): Promise<TodoModel[]>
  findMany(from?: Date | string, to?: Date | string) {
    return this.repo.find({
      where: {
        ...(from &&
          to && {
            startTime: Between(new Date(from), new Date(to)),
          }),
      },
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
