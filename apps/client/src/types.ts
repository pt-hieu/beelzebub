export type ModalButton = {
  text: string
  icon?: `fa fa-${string}`
  disabled?: boolean
  onClick: () => void | Promise<void>
}
