export interface Bookmark {
  checksum: string
  roots: Roots
  sync_metadata: string
  version: number
}

interface Roots {
  bookmark_bar: BookmarkBar
  other: Children
  synced: Children
}

interface BookmarkBar {
  children: Children[]
  date_added: string
  date_modified: string
  guid: string
  id: string
  name: string
  type: Type
}

export type Children = {
  date_added: string
  guid: string
  id: string
  name: string
  date_modified?: string
} & (
  | {
      type: Type.Folder
      children: Children[]
      url?: never
    }
  | {
      type: Type.URL
      children?: never
      url: string
    }
)

export enum Type {
  Folder = 'folder',
  URL = 'url',
}
