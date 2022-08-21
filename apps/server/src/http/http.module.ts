import { Module } from '@nestjs/common'
import { HttpModule as AxiosModule } from '@nestjs/axios'
import { GithubService } from './github.service.js'
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
  providers: [GithubService],
  exports: [GithubService],
})
export class HttpModule {}
