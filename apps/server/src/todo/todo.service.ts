import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TodoModel } from './todo.model'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoModel) private readonly repo: Repository<TodoModel>,
  ) {}

  findWithDeadlineAsc() {
    return this.repo.find({
      order: {
        deadline: 'asc',
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
