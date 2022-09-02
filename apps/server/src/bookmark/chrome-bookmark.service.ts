import { Bookmark, Children, Type } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'

@Injectable()
export class ChromeBookmarkService {
  private version = 1

  constructor() {}

  private assertChromeFolder(
    bookmarkChildren: Children,
  ): asserts bookmarkChildren is Children & { type: Type.Folder } {
    if (bookmarkChildren.type !== Type.Folder)
      throw new Error('Bookmark is not a folder')
  }

  private assertChromeUrl(
    bookmarkChildren: Children,
  ): asserts bookmarkChildren is Children & { type: Type.URL } {
    if (bookmarkChildren.type !== Type.URL)
      throw new Error('Bookmark is not an url')
  }

  private parseChromeChildren(children: Children): string[] {
    try {
      this.assertChromeFolder(children)

      let urls: string[] = []
      children.children.forEach((child) => {
        urls = [...urls, ...this.parseChromeChildren(child)]
      })

      return urls
    } catch (e) {}

    try {
      this.assertChromeUrl(children)
      if (children.url.startsWith('http') || children.url.startsWith('https'))
        return [children.url]
    } catch (e) {}

    return []
  }

  parse(input: Bookmark) {
    if (input.version !== this.version) {
      return null
    }

    let urls: string[] = []
    const children: Children[] = [
      input.roots.synced,
      input.roots.other,
      ...input.roots.bookmark_bar.children,
    ]

    children.forEach((child) => {
      urls = urls.concat(this.parseChromeChildren(child))
    })

    return urls
  }
}
