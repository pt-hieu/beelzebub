import { Event } from '@beelzebub/types'

import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { nanoid } from 'nanoid'

import { CrawlLinkEvent } from './link.event.js'
import { CreateLinkDto, UpdateLinkDto } from './link.input.js'
import { LinkModel } from './link.model.js'
import { LinkService } from './link.service.js'

@Resolver(() => LinkModel)
export class LinkResolver {
  constructor(
    private linkService: LinkService,
    private emitter: EventEmitter2,
  ) {}

  @Query(() => [LinkModel])
  links() {
    return this.linkService.getAll()
  }

  @Mutation(() => LinkModel)
  async createLink(@Args('dto') dto: CreateLinkDto) {
    dto.alias = dto.alias || nanoid(3)
    const result = await this.linkService.create(dto.url, dto.alias)

    const crawlEvent = new CrawlLinkEvent(result.url)
    this.emitter.emitAsync(Event.LinkEvent.CRAWL, crawlEvent)

    return result
  }

  @Mutation(() => LinkModel)
  async updateLink(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('dto') dto: UpdateLinkDto,
  ) {
    const link = await this.linkService.getOne(id)
    if (!link) throw new NotFoundException()

    return this.linkService.update({ ...link, ...dto })
  }

  @Mutation(() => LinkModel)
  async deleteLink(@Args('id', ParseUUIDPipe) id: string) {
    const link = await this.linkService.getOne(id)
    if (!link) throw new NotFoundException()

    return this.linkService.del(link).then((r) => ({ ...r, id }))
  }
}
