import { BaseEvent } from '../misc/base.event.js'

export class CrawlLinkEvent extends BaseEvent {
  constructor(readonly url: string) {
    super()
  }
}
