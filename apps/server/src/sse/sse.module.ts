import { Module } from '@nestjs/common'

import { SseController } from './sse.controller.js'
import { SseService } from './sse.service.js'

@Module({
  providers: [SseService],
  exports: [SseService],
  controllers: [SseController],
})
export class SseModule {}
