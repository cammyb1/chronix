import { EventBus } from './EventBus';
import type { AnimationEngine, IAnimationEvents } from './engines/AnimationEngine';
import type { AnimationPlayerConfig } from './types';

export class AnimationPlayer<TRoot = any, TTrack = any> extends EventBus<
  IAnimationEvents<TRoot, TTrack>
> {
  protected running: boolean = false;

  time: number;
  duration: number;
  loop: boolean;

  protected engine: AnimationEngine<TRoot, TTrack> | undefined;

  constructor(config: Partial<AnimationPlayerConfig> = {}) {
    super();
    this.duration = config?.duration || 1;
    this.loop = config?.loop || false;
    this.time = config?.startTime || 0;

    if (config?.startTime) {
      this._updateTime(this.time);
    }
    this.engine = config?.engine;

    if (this.engine) {
      this._propagateEngine();
    }
  }

  setDuration(dur: number): this {
    this.duration = dur;
    this.engine?.setDuration(dur);
    return this;
  }

  getDuration(): number {
    return this.duration;
  }

  clear(): void {
    this.engine?.clearTracks();
  }

  play(): this {
    this.running = true;
    this.trigger('play');
    return this;
  }

  pause(): this {
    this.running = false;
    this.trigger('pause');
    return this;
  }

  stop(): this {
    this.running = false;
    this.setTime(0);
    this.trigger('stop');
    return this;
  }

  fromArray(array: TTrack[]) {
    this.engine?.fromArray(array);
  }

  getTracks(): TTrack[] {
    return this.engine?.getTracks() || [];
  }

  getTime(): number {
    return this.time;
  }

  isRunning(): boolean {
    return this.running;
  }

  setEngine(engine: AnimationEngine<TRoot, TTrack>): this {
    this.engine = engine;
    this._propagateEngine();

    return this;
  }

  private _propagateEngine(): void {
    if (!this.engine) return;
    // Auto-propagate engine events
    this.engine.on('timeUpdate', (e) => this.trigger('timeUpdate', e));
    this.engine.on('durationChange', (e) => this.trigger('durationChange', e));
    this.engine.on('trackAdd', (e) => this.trigger('trackAdd', e));
    this.engine.on('trackRemove', (e) => this.trigger('trackRemove', e));
    this.engine.on('trackUpdate', (e) => this.trigger('trackUpdate', e));
    this.engine.on('rootChange', (e) => this.trigger('rootChange', e));
  }

  private _updateTime(t: number): void {
    this.time = t;
    this.engine?.setTime(t);
  }

  update(dt: number): void {
    if (!this.running) return;
    let time = this.time + dt;

    if (!this.loop && time > this.duration) {
      time = this.duration;
      this.pause();
    } else if (time > this.duration) {
      time = 0;
    }

    this._updateTime(time);
  }

  setTime(t: number) {
    this._updateTime(t);
  }
}
