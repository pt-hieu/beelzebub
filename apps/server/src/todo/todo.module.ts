import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoModel } from './todo.model'
import { TodoResolver } from './todo.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel])],
  providers: [TodoResolver],
})
export class TodoModule {}
