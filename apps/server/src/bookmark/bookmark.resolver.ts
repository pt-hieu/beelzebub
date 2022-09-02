import { Event } from '@beelzebub/types'

import { ParseEnumPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { ImportBookmarkDto } from './bookmark.input.js'
import { ChromeBookmarkService } from './chrome-bookmark.service.js'

import { CrawlLinkEvent } from '../link/link.event.js'
import { LinkModel } from '../link/link.model.js'
import { LinkService } from '../link/link.service.js'

enum ImportLinkSource {
  CHROME = 'CHROME',
}

@Resolver(() => LinkModel)
export class BookmarkResolver {
  constructor(
    private chromeBookmarkServiec: ChromeBookmarkService,
    private linkService: LinkService,
    private emitter: EventEmitter2,
  ) {}

  @Mutation(() => [LinkModel])
  async importLinks(
    @Args('source', new ParseEnumPipe(ImportLinkSource))
    source: ImportLinkSource,
    @Args('dto')
    dto: ImportBookmarkDto,
  ) {
    const { createReadStream } = await dto.file

    return new Promise((resolve, reject) => {
      const stream = createReadStream()
      const chunks = []

      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on('error', (err) => reject(err))
      stream.on('end', async () => {
        const bookmarkContent = Buffer.concat(chunks).toString('utf8')

        if (source === ImportLinkSource.CHROME) {
          const urls = this.chromeBookmarkServiec.parse(
            JSON.parse(bookmarkContent),
          )

          const links = await this.linkService.create(
            urls.map((url) => ({ url })),
          )

          urls.forEach((url) => {
            const crawlEvent = new CrawlLinkEvent(url)
            this.emitter.emitAsync(Event.LinkEvent.CRAWL, crawlEvent)
          })

          resolve(links)
        }
      })
    })
  }
}
