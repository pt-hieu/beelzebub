import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LinkController } from './link.controller.js'
import { LinkModel } from './link.model.js'
import { LinkResolver } from './link.resolver.js'
import { LinkService } from './link.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([LinkModel])],
  controllers: [LinkController],
  providers: [LinkService, LinkResolver],
  exports: [LinkService],
})
export class LinkModule {}
