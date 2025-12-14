export class EventBus<E extends {} = {}> {
  private _listeners: Map<keyof E, Set<Function>> = new Map();

  has(type: keyof E, cb: (event: any) => void) {
    if (!this._listeners.has(type)) return false;
    return this._listeners.get(type)!.has(cb);
  }

  on<T extends keyof E>(type: T, cb: (event: E[T]) => void) {
    if (this.has(type, cb)) return;
    const set = this._listeners.get(type) || new Set<Function>();
    set.add(cb);
    this._listeners.set(type, set);
  }

  once<T extends keyof E>(type: T, cb: (event: E[T]) => void) {
    const onceCb = (event: E[T]) => {
      cb(event);
      this.off(type, onceCb);
    };
    this.on(type, onceCb);
  }

  disposeSingle<T extends keyof E>(type: T) {
    if (!this._listeners.has(type)) {
      throw new Error(`[EventBus] Current type: ${String(type)} does not exist.`);
    }
    this._listeners.get(type)?.clear();
  }

  disposeAll() {
    this._listeners.clear();
  }

  off<T extends keyof E>(type: T, cb: (event: E[T]) => void) {
    if (!this.has(type, cb)) return;
    this._listeners.get(type)!.delete(cb);
  }

  trigger<T extends keyof E>(type: T, payload?: E[T]) {
    const event = { type, ...(payload || {}) } as E[T];
    this._listeners.get(type)?.forEach((cb) => cb(event));
  }
}
