import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LinkController } from './link.controller.js'
import { LinkListener } from './link.listener.js'
import { LinkModel } from './link.model.js'
import { LinkResolver } from './link.resolver.js'
import { LinkService } from './link.service.js'

import { ScraperService } from '../misc/scaper.service.js'
import { SseModule } from '../sse/sse.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([LinkModel]), SseModule],
  controllers: [LinkController],
  providers: [LinkService, LinkResolver, LinkListener, ScraperService],
  exports: [LinkService],
})
export class LinkModule {}
