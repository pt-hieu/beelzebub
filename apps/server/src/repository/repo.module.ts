import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppSubscription } from '../app.subscription.js'
import { HttpModule } from '../http/http.module.js'
import { RepoListener } from './repo.listener.js'
import { RepoModel } from './repo.model.js'
import { RepoResolver } from './repo.resolver.js'
import { RepoService } from './repo.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([RepoModel]), HttpModule],
  providers: [RepoResolver, RepoService, RepoListener, AppSubscription],
  exports: [RepoService],
})
export class RepoModule {}
