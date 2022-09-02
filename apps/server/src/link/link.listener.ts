import { Event } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { CrawlLinkEvent } from './link.event.js'
import { LinkModel } from './link.model.js'
import { LinkService } from './link.service.js'

import { ScraperService } from '../misc/scaper.service.js'
import { SseService } from '../sse/sse.service.js'

@Injectable()
export class LinkListener {
  constructor(
    private sseService: SseService,
    private linkService: LinkService,
    private scraper: ScraperService,
  ) {}

  @OnEvent(Event.LinkEvent.CRAWL, { async: true })
  async crawl({ url }: CrawlLinkEvent) {
    const [links, scrapeResult] = await Promise.all([
      this.linkService.getAll(url),
      this.scraper.do(url),
    ])

    let updatedLinks: LinkModel[]

    if (scrapeResult) {
      const { ogTitle, ogImage, ogDescription } = scrapeResult

      updatedLinks = await this.linkService.update(
        links.map((link) => ({
          ...link,
          scrapeStatus: 'Done',
          image: ogImage,
          description: ogDescription,
          title: ogTitle,
        })),
      )
    }

    if (!scrapeResult) {
      updatedLinks = await this.linkService.update(
        links.map((link) => ({
          ...link,
          scrapeStatus: 'Error',
        })),
      )
    }

    this.sseService.emit({
      type: 'link.crawl.1',
      payload: updatedLinks,
    })
  }
}
