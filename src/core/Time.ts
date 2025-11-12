import { EventBus } from './EventBus';

export interface TimeEvents {
  loop: {};
}

class TimeSingleton extends EventBus<TimeEvents> {
  private _startTime: number = 0;
  private _oldTime: number = 0;
  private _requestId: number = 0;

  public running: boolean = false;
  public delta: number = 0;
  public elapsed: number = 0;

  constructor() {
    super();
  }

  private _loop() {
    let diff = 0;

    if (this.running) {
      const current = performance.now();

      diff = (current - this._oldTime) / 1000;
      this._oldTime = current;
      this.elapsed += diff;
    }

    this.delta = diff;

    this.trigger('loop');

    this._requestId = requestAnimationFrame(this._loop.bind(this));
  }

  public start() {
    this._startTime = performance.now();
    this._oldTime = this._startTime;
    this.elapsed = 0;
    this.delta = 0;

    this.running = true;

    this._loop();
  }

  public stop() {
    this.running = false;

    cancelAnimationFrame(this._requestId);
    this._requestId = 0;
  }
}

export let Time = new TimeSingleton();
