import { HttpException, Injectable, Logger } from '@nestjs/common'
import { HttpService as AxiosService } from '@nestjs/axios'
import { ConfigService } from 'src/config/config.service'
import { catchError, first, lastValueFrom, map, Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { GitHub } from '@beelzebub/types'

@Injectable()
export class GithubService {
  private readonly GITHUB_ENDPOINT = 'https://api.github.com'
  private logger = new Logger(GithubService.name)

  constructor(
    private axios: AxiosService,
    private configService: ConfigService,
  ) {}

  private process<T>($obs: Observable<AxiosResponse<T>>) {
    return lastValueFrom(
      $obs.pipe(
        map((res) => this.modifyResponse(res.data) as T),
        first(),
        catchError((e) => {
          this.logger.error(e.response?.data || e.message)

          throw new HttpException(
            e.response?.data || e.message,
            e.response?.status || 500,
          )
        }),
      ),
    )
  }

  private modifyObject<T>(obj: T): T {
    if (!obj) return obj

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        this.modifyObject(value)
      }

      if (
        typeof value === 'string' &&
        value.startsWith('https://') &&
        key !== 'html_url' &&
        key !== 'avatar_url'
      ) {
        delete obj[key]
      }
    })

    return obj
  }

  private modifyResponse<T>(res: T) {
    if (Array.isArray(res)) {
      return res.map((item) => {
        return Array.isArray(item)
          ? this.modifyResponse(item)
          : this.modifyObject(item)
      })
    }

    return this.modifyObject(res)
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

  async fetchCollaborators(name: string) {
    const token = (await this.configService.get()).github_token

    return this.process(
      this.axios.get<GitHub.Collaborator[]>(
        `${this.GITHUB_ENDPOINT}/repos/${name}/collaborators`,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      ),
    )
  }

  async createRepo(name: string, options?: GitHub.UpdateRepository) {
    const token = (await this.configService.get()).github_token

    return this.process(
      this.axios.post<GitHub.Repository>(
        `${this.GITHUB_ENDPOINT}/user/repos`,
        {
          name,
          ...options,
        },
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      ),
    )
  }

  async updateRepo(name: string, dto: GitHub.UpdateRepository) {
    const token = (await this.configService.get()).github_token

    return this.process(
      this.axios.patch<GitHub.Repository>(
        `${this.GITHUB_ENDPOINT}/repos/${name}`,
        dto,
        {
          headers: {
            authorization: `token ${token}`,
          },
        },
      ),
    )
  }

  async deleteRepository(name: string) {
    const token = (await this.configService.get()).github_token

    return this.process(
      this.axios.delete<undefined>(`${this.GITHUB_ENDPOINT}/repos/${name}`, {
        headers: {
          authorization: `token ${token}`,
        },
      }),
    )
  }
}
