import { Event } from '@beelzebub/types'
import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GithubService } from 'src/http/github.service'
import { RepoSyncedEvent } from './repo.event'
import { UpdateRepositoryDto } from './repo.input'
import { RepoModel } from './repo.model'
import { RepoService } from './repo.service'

@Resolver(() => RepoModel)
export class RepoResolver {
  constructor(
    private repoService: RepoService,
    private githubService: GithubService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async getOneById(id: string) {
    const repo = await this.repoService.getOneById(id)
    if (!repo) throw new NotFoundException('Repo not found')

    return repo
  }

  @Query(() => [RepoModel])
  repoes() {
    return this.repoService.getMany()
  }

  @Query(() => RepoModel)
  repo(@Args('id', ParseUUIDPipe) id: string) {
    return this.repoService.getOneById(id)
  }

  @Mutation(() => RepoModel)
  async updateRepo(
    @Args('id', ParseUUIDPipe) repoId: string,
    @Args('dto') dto: UpdateRepositoryDto,
  ) {
    const repo = await this.getOneById(repoId)

    const updatedRepo = await this.githubService.updateRepo(repo.name, dto)
    return this.repoService.updateGitHubRepository(repoId, updatedRepo)
  }

  @Mutation(() => RepoModel)
  async deleteRepo(@Args('id', ParseUUIDPipe) repoId: string) {
    const repo = await this.getOneById(repoId)

    await this.githubService.deleteRepository(repo.name)
    return this.repoService.delete(repo)
  }

  @Mutation(() => RepoModel)
  async fetchCollaborators(@Args('id', ParseUUIDPipe) repoId: string) {
    const repo = await this.getOneById(repoId)
    const collabs = await this.githubService.fetchCollaborators(repo.name)

    return this.repoService
      .massSave([{ ...repo, collabs: collabs.map((col) => ({ ...col })) }])
      .then((res) => res[0])
  }

  @Mutation(() => [RepoModel])
  async syncRepo() {
    const repos = await this.githubService.getRepositories()

    const syncDate = new Date()
    const syncResults = await this.repoService.upsertOnName(
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
    const outdated = await this.repoService.getOutdated()
    return this.repoService.massDelete(outdated)
  }
}
