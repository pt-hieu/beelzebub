type ShortcutScope = 'global' | 'link' | 'repository'
type ShortcutTag = 'general' | 'link' | 'repository'

export type Shortcut = {
  keys: string
  scope: ShortcutScope
  tag: ShortcutTag
  description: string
}

export const shortcuts: Shortcut[] = [
  {
    keys: 'Control+Alt+Q',
    scope: 'global',
    description: 'Create a link from the url in clipboard',
    tag: 'link',
  },
]
