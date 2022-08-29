import { NotFoundException, ParseUUIDPipe } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateLinkDto, UpdateLinkDto } from './link.input.js'
import { LinkModel } from './link.model.js'
import { LinkService } from './link.service.js'

@Resolver(() => LinkModel)
export class LinkResolver {
  constructor(private linkService: LinkService) {}

  @Query(() => [LinkModel])
  getAll() {
    return this.linkService.getAll()
  }

  @Mutation(() => LinkModel)
  create(@Args('dto') dto: CreateLinkDto) {
    return this.linkService.create(dto.url, dto.alias)
  }

  @Mutation(() => LinkModel)
  async update(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('dto') dto: UpdateLinkDto,
  ) {
    const link = await this.linkService.getOne(id)
    if (!link) throw new NotFoundException()

    return this.linkService.update({ ...link, ...dto })
  }

  @Mutation(() => LinkModel)
  async delete(@Args('id', ParseUUIDPipe) id: string) {
    const link = await this.linkService.getOne(id)
    if (!link) throw new NotFoundException()

    return this.linkService.del(link)
  }
}
