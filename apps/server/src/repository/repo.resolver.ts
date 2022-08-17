import { Event } from '@beelzebub/types'
import { ParseUUIDPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GithubService } from 'src/http/github.service'
import { RepoSyncedEvent } from './repo.event'
import { RepoModel } from './repo.model'
import { RepoService } from './repo.service'

@Resolver(() => RepoModel)
export class RepoResolver {
  constructor(
    private repoSerivce: RepoService,
    private githubService: GithubService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => [RepoModel])
  repoes() {
    return this.repoSerivce.getMany()
  }

  @Query(() => RepoModel)
  repo(@Args('id', ParseUUIDPipe) id: string) {
    return this.repoSerivce.getOneById(id)
  }

  @Mutation(() => [RepoModel])
  async syncRepo() {
    const repos = await this.githubService.getRepositories()

    const syncDate = new Date()
    const syncResults = await this.repoSerivce.upsertOnName(
      repos.map((repo) => ({
        name: repo.full_name,
        data: repo,
        synced_at: syncDate,
      })),
    )

    const syncedEvent = new RepoSyncedEvent({ syncDate })
    this.eventEmitter.emitAsync(Event.RepoEvent.SYNCED, syncedEvent)

    return syncResults
  }

  @Mutation(() => [RepoModel])
  async purgeOutdatedRepos() {
    const outdated = await this.repoSerivce.getOutdated()
    return this.repoSerivce.massDelete(outdated)
  }
}
