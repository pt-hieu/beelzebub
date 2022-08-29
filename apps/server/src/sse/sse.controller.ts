import { Controller, Req, Sse } from '@nestjs/common'
import { Request } from 'express'

import { SseService } from './sse.service.js'

@Controller()
export class SseController {
  constructor(private appSubs: SseService) {}

  @Sse('subscribe')
  subscribe(@Req() req: Request) {
    const { $sub, listener } = this.appSubs.subscribe()

    req.on('close', () => {
      listener.off()
    })

    return $sub.asObservable()
  }
}
