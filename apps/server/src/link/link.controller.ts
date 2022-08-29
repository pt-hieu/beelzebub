import { Controller, Get, Param, Redirect } from '@nestjs/common'

import { LinkService } from './link.service.js'

@Controller('s')
export class LinkController {
  constructor(private service: LinkService) {}

  @Get(':alias')
  @Redirect()
  get(@Param('alias') alias: string) {
    return this.service.getByAlias(alias).then((r) => ({ url: r.url }))
  }
}
