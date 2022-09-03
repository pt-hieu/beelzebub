import { Event } from '@beelzebub/types'

import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { CrawlLinkEvent } from './link.event.js'
import { LinkModel } from './link.model.js'
import { LinkService } from './link.service.js'

import { ScraperService } from '../misc/scaper.service.js'
import { SseService } from '../sse/sse.service.js'

@Injectable()
export class LinkListener {
  private logger = new Logger(LinkListener.name)

  constructor(
    private sseService: SseService,
    private linkService: LinkService,
    private scraper: ScraperService,
  ) {}

  @OnEvent(Event.LinkEvent.CRAWL, { async: true })
  async crawl({ urls }: CrawlLinkEvent) {
    const [links, scrapeResults] = await Promise.all([
      this.linkService.getAll(urls),
      this.scraper.doMany(urls),
    ])

    scrapeResults.forEach(async (promise, index) => {
      const scrapeResult = await promise

      const linkWithScrapeUrl = links.filter((link) => link.url === urls[index])
      let updatedLinks: LinkModel[]

      if (scrapeResult) {
        const { ogTitle, ogImage, ogDescription } = scrapeResult

        updatedLinks = await this.linkService.update(
          linkWithScrapeUrl.map((link) => ({
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
          linkWithScrapeUrl.map((link) => ({
            ...link,
            scrapeStatus: 'Error',
          })),
        )
      }

      this.sseService.emit({
        type: 'link.crawl.1',
        payload: updatedLinks,
      })
    })
  }
}
