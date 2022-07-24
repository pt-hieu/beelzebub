import { Module } from '@nestjs/common'
import { HttpModule as AxiosModule } from '@nestjs/axios'
import { GithubService } from './github.service'
import { ConfigModule } from 'src/config/config.module'

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
