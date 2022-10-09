export type ModalButton = {
  text: string
  icon?: `fa fa-${string}`
  loading?: boolean
  disabled?: boolean
  onClick: () => void | Promise<void>
}
