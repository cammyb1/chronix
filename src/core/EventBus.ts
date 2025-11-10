import { EventDispatcher, type BaseEvent } from 'three';

export class EventBus<E extends {} = {}> extends EventDispatcher<E> {
  on<T extends Extract<keyof E, string>>(type: T, cb: (event: E[T]) => void) {
    if (this.hasEventListener(type, cb)) return;
    this.addEventListener(type, cb);
  }
  off<T extends Extract<keyof E, string>>(type: T, cb: (event: E[T]) => void) {
    if (!this.hasEventListener(type, cb)) return;
    this.removeEventListener(type, cb);
  }
  trigger<T extends Extract<keyof E, string>>(payload: BaseEvent<T> & E[T]) {
    this.dispatchEvent({ ...payload });
  }
}
