import { HttpModule as AxiosModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { GitHubGraphService } from './github-graphql.service.js'
import { GithubRestService } from './github-rest.service.js'

import { ConfigModule } from '../config/config.module.js'

@Module({
  imports: [
    ConfigModule,
    AxiosModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        Accept: 'application/vnd.github+json',
      },
    }),
  ],
  providers: [GithubRestService, GitHubGraphService],
  exports: [GithubRestService, GitHubGraphService],
})
export class HttpModule {}
