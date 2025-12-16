import { EventBus } from './EventBus';
import type { AnimationEngine } from './engines/AnimationEngine';
import type { AnimationPlayerConfig, IAnimationEvents } from './types';

export class AnimationPlayer<TRoot = any, TTrack extends object = any> extends EventBus<
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
    this.time = 0;

    if (config?.engine) {
      this.setEngine(config.engine);
    }

    if (config?.startTime) {
      this.time = config.startTime;
      this.seek(config.startTime);
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
    this.seek(0);
    this.trigger('stop');
    return this;
  }

  toggle(): this {
    return this.running ? this.pause() : this.play();
  }

  restart(): this {
    this.seek(0);
    this.play();
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
    this.engine.setDuration(this.duration);
    this.engine.setTime(this.time);
    this._propagateEngine();

    return this;
  }

  getEngine(): AnimationEngine<TRoot, TTrack> | undefined {
    return this.engine;
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

  seek(t: number) {
    if (t < 0 || t > this.duration) {
      throw new Error(`Time must be between 0 and ${this.duration}`);
    }
    this._updateTime(t);
  }

  private _propagateEngine(): void {
    if (!this.engine) return;
    // Auto-propagate engine events
    this.engine.on('timeUpdate', (e) => this.trigger('timeUpdate', e));
    this.engine.on('durationChange', (e) => {
      this.duration = e.duration;
      this.trigger('durationChange', e);
    });
    this.engine.on('trackAdd', (e) => this.trigger('trackAdd', e));
    this.engine.on('trackRemove', (e) => this.trigger('trackRemove', e));
    this.engine.on('trackUpdate', (e) => this.trigger('trackUpdate', e));
    this.engine.on('rootChange', (e) => this.trigger('rootChange', e));
  }
}
