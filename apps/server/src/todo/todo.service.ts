import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TodoModel } from './todo.model.js'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
  ) {}

  findMany() {
    return this.repo.find({
      order: {
        created_at: 'desc',
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
