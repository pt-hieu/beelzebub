import { Module } from '@nestjs/common'

import { BookmarkResolver } from './bookmark.resolver.js'
import { ChromeBookmarkService } from './chrome-bookmark.service.js'

import { LinkModule } from '../link/link.module.js'

@Module({
  imports: [LinkModule],
  providers: [ChromeBookmarkService, BookmarkResolver],
})
export class BookmarkModule {}
