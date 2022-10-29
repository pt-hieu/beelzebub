import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoInterceptor } from './todo.interceptor.js'
import { TodoListener } from './todo.listener.js'
import { TodoModel } from './todo.model.js'
import { ParseTodoUUIDPipe } from './todo.pipe.js'
import { TodoSubscriber } from './todo.reminder.js'
import { TodoResolver } from './todo.resolver.js'
import { TodoService } from './todo.service.js'

import { SchedulerService } from '../misc/scheduler.service.js'
import { SseModule } from '../sse/sse.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel]), SseModule],
  providers: [
    TodoResolver,
    TodoService,
    SchedulerService,
    TodoSubscriber,
    TodoListener,
    TodoInterceptor,
    ParseTodoUUIDPipe,
  ],
  exports: [TodoService],
})
export class TodoModule {}
