import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoModel } from './todo.model.js'
import { TodoResolver } from './todo.resolver.js'
import { TodoService } from './todo.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel])],
  providers: [TodoResolver, TodoService],
  exports: [TodoService],
})
export class TodoModule {}
