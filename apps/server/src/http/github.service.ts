import { HttpException, Injectable } from '@nestjs/common'
import { HttpService as AxiosService } from '@nestjs/axios'
import { ConfigService } from 'src/config/config.service'
import { catchError, first, lastValueFrom, map, Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { GitHub } from '@black/share'

@Injectable()
export class GithubService {
  private readonly GITHUB_ENDPOINT = 'https://api.github.com'

  constructor(
    private axios: AxiosService,
    private configService: ConfigService,
  ) {}

  private process<T>($obs: Observable<AxiosResponse<T>>) {
    return lastValueFrom(
      $obs.pipe(
        map((res) => res.data),
        first(),
        catchError((e) => {
          throw new HttpException(e.response?.data, e.response?.status)
        }),
      ),
    )
  }

  async getRepositories() {
    const token = (await this.configService.get()).github_token

    return this.process(
      this.axios.get<GitHub.Repository[]>(
        `${this.GITHUB_ENDPOINT}/user/repos`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      ),
    )
  }
}
