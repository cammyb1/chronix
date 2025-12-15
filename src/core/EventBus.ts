export class EventBus<E extends { [key: string]: any } = {}> {
  private _listeners: Map<string, Set<Function>> = new Map();

  has(type: string, cb: (event: any) => void): boolean {
    if (!this._listeners.has(type)) return false;
    return this._listeners.get(type)!.has(cb);
  }

  on<T extends string>(type: T, cb: (event: E[T]) => void): void {
    if (this.has(type, cb)) return;
    const set = this._listeners.get(type) || new Set<Function>();
    set.add(cb);
    this._listeners.set(type, set);
  }

  once<T extends string>(type: T, cb: (event: E[T]) => void): void {
    const onceCb = (event: E[T]) => {
      cb(event);
      this.off(type, onceCb);
    };
    this.on(type, onceCb);
  }

  disposeSingle<T extends string>(type: T): void {
    if (!this._listeners.has(type)) {
      throw new Error(`[EventBus] Current type: ${String(type)} does not exist.`);
    }
    this._listeners.get(type)?.clear();
  }

  disposeAll(): void {
    this._listeners.clear();
  }

  off<T extends string>(type: T, cb: (event: E[T]) => void): void {
    if (!this.has(type, cb)) return;
    this._listeners.get(type)!.delete(cb);
  }

  trigger<T extends string>(type: T, payload?: E[T]): void {
    const event = { type, ...(payload || {}) } as E[T];
    this._listeners.get(type)?.forEach((cb) => cb(event));
  }
}
