import { Controller, Sse } from '@nestjs/common'
import { AppSubscription } from './app.subscription.js'

@Controller()
export class AppController {
  constructor(private appSubs: AppSubscription) {}

  @Sse('subscribe')
  subscribe() {
    return this.appSubs.getEmitter()
  }
}
