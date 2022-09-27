import { Controller, Query, Req, Sse } from '@nestjs/common'
import { Request } from 'express'

import { SseService } from './sse.service.js'

@Controller()
export class SseController {
  constructor(private appSubs: SseService) {}

  @Sse('subscribe')
  subscribe(@Req() req: Request, @Query('channel') channel: string) {
    channel = channel || undefined
    const { $sub } = this.appSubs.subscribe(channel)

    req.on('close', () => {
      this.appSubs.removeSubscription(channel)
    })

    return $sub.asObservable()
  }
}
