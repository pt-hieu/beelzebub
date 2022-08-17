import { Event } from '@beelzebub/types'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { AppSubscription } from 'src/app.subscription'
import { RepoSyncedEvent } from './repo.event'
import { RepoService } from './repo.service'

@Injectable()
export class RepoListener {
  constructor(
    private repoService: RepoService,
    private appSubs: AppSubscription,
  ) {}

  @OnEvent(Event.RepoEvent.SYNCED, { async: true })
  async onRepoSynced(event: RepoSyncedEvent) {
    const outdatedRepoes = await this.repoService.getOutdated(event.syncDate)
    await this.repoService.massSave(
      outdatedRepoes.map((repo) => ({ ...repo, outdated: true })),
    )

    this.appSubs.emit(`${Event.RepoEvent.SYNCED}.1`, {
      count: outdatedRepoes.length,
    })
  }
}
