import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppSubscription } from 'src/app.subscription'
import { HttpModule } from 'src/http/http.module.'
import { RepoListener } from './repo.listener'
import { RepoModel } from './repo.model'
import { RepoResolver } from './repo.resolver'
import { RepoService } from './repo.service'

@Module({
  imports: [TypeOrmModule.forFeature([RepoModel]), HttpModule],
  providers: [RepoResolver, RepoService, RepoListener, AppSubscription],
  exports: [RepoService],
})
export class RepoModule {}
