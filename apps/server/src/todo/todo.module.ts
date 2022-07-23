import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoModel } from './todo.model'
import { TodoResolver } from './todo.resolver'
import { TodoService } from './todo.service'

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel])],
  providers: [TodoResolver, TodoService],
  exports: [TodoService],
})
export class TodoModule {}
