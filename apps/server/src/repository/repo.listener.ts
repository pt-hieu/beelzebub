import { Event } from '@beelzebub/types'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { SseService } from '../sse/sse.service.js'
import { RepoSyncedEvent } from './repo.event.js'
import { RepoService } from './repo.service.js'

@Injectable()
export class RepoListener {
  constructor(
    private repoService: RepoService,
    private sseService: SseService,
  ) {}

  @OnEvent(Event.RepoEvent.SYNCED, { async: true })
  async onRepoSynced(event: RepoSyncedEvent) {
    const outdatedRepoes = await this.repoService.getOutdated(event.syncDate)
    await this.repoService.massSave(
      outdatedRepoes.map((repo) => ({ ...repo, outdated: true })),
    )

    this.sseService.emit({
      type: `${Event.RepoEvent.SYNCED}.1`,
      payload: {
        count: outdatedRepoes.length,
      },
    })
  }
}
