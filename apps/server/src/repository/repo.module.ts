import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RepoListener } from './repo.listener.js'
import { RepoModel } from './repo.model.js'
import { RepoResolver } from './repo.resolver.js'
import { RepoService } from './repo.service.js'

import { HttpModule } from '../http/http.module.js'
import { SseModule } from '../sse/sse.module.js'

@Module({
  imports: [TypeOrmModule.forFeature([RepoModel]), HttpModule, SseModule],
  providers: [RepoResolver, RepoService, RepoListener],
  exports: [RepoService],
})
export class RepoModule {}
