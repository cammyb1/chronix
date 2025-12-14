import { EventBus } from './EventBus';
import type { AnimationEngine, IAnimationEvents } from './engines/AnimationEngine';

export class AnimationPlayer<TRoot = any, TTrack = any> extends EventBus<
  IAnimationEvents<TRoot, TTrack>
> {
  protected running: boolean = false;

  time: number;
  duration: number;
  loop: boolean;

  protected engine: AnimationEngine<TRoot, TTrack>;

  constructor(engine: AnimationEngine<TRoot, TTrack>) {
    super();
    this.engine = engine;
    this.time = 0;
    this.duration = 1;
    this.loop = false;

    // Auto-propagate engine events
    this.engine.on('timeUpdate', (e) => this.trigger('timeUpdate', e));
    this.engine.on('durationChange', (e) => this.trigger('durationChange', e));
    this.engine.on('trackAdd', (e) => this.trigger('trackAdd', e));
    this.engine.on('trackRemove', (e) => this.trigger('trackRemove', e));
    this.engine.on('trackUpdate', (e) => this.trigger('trackUpdate', e));
    this.engine.on('rootChange', (e) => this.trigger('rootChange', e));
  }

  setDuration(dur: number): this {
    this.duration = dur;
    this.engine.setDuration(dur);
    return this;
  }

  getDuration(): number {
    return this.duration;
  }

  clear() {
    this.engine.clearTracks();
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

  private _updateTime(t: number) {
    this.time = t;
    this.engine.setTime(t);
  }

  update(dt: number) {
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

  getTracks(): TTrack[] {
    return this.engine.getTracks();
  }

  getTime() {
    return this.time;
  }

  isRunning(): boolean {
    return this.running;
  }

  setTime(t: number) {
    this._updateTime(t);
  }
}
