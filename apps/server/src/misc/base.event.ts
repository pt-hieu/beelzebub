export abstract class BaseEvent {
  constructor(props?: unknown) {
    props && Object.assign(this, props)
  }
}
