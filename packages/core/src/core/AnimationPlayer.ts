import { EventBus } from './EventBus';
import { VanillaAnimationEngine } from './engines/VanillaAnimationEngine';
import { AnimationEngine } from './AnimationEngine';
import type { AnimationPlayerConfig, IAnimationEvents, TrackLike } from './types';

export default class AnimationPlayer<
  TRoot = any,
  TTrack extends TrackLike = TrackLike,
> extends EventBus<IAnimationEvents<TRoot, TTrack>> {
  protected running: boolean = false;

  time: number;
  duration: number;
  loop: boolean;

  protected static engines: Map<string, new (...args: any[]) => AnimationEngine<any, any>> =
    new Map();

  static {
    this.registerEngine('vanilla', VanillaAnimationEngine);
  }

  static registerEngine(
    name: string,
    engineClass: new (...args: any[]) => AnimationEngine<any, any>,
  ) {
    this.engines.set(name, engineClass);
  }

  protected _engine: AnimationEngine<TRoot, TTrack> | undefined;

  constructor(config: Partial<AnimationPlayerConfig> = {}) {
    super();
    this.duration = config?.duration || 1;
    this.loop = config?.loop || false;
    this.time = 0;

    if (config.autoStart) {
      this.play();
    }

    if (config?.engine) {
      this.setEngine(config.engine, config.root);
    } else {
      this.setEngine('vanilla', config.root);
    }

    if (config?.startTime) {
      this.time = config.startTime;
      this.seek(config.startTime);
    }
  }

  setDuration(dur: number): this {
    this.duration = dur;
    this._engine?.active?.setDuration(dur);
    this.trigger('durationChange', { duration: dur });
    return this;
  }

  getDuration(): number {
    return this.duration;
  }

  clear(): void {
    this._engine?.active?.clearTracks();
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

  getTime(): number {
    return this.time;
  }

  isRunning(): boolean {
    return this.running;
  }

  setEngine(
    engine: AnimationEngine<TRoot, TTrack> | string,
    ...args: [r?: TRoot, ...rest: any]
  ): this {
    let intance;

    if (typeof engine === 'string') {
      const EngineClass = AnimationPlayer.engines.get(engine);
      if (!EngineClass) {
        throw new Error(`Engine ${engine} not found`);
      }

      intance = new EngineClass(...args);
    } else {
      intance = engine;
    }

    this._engine = intance;
    this._engine.active?.setDuration(this.duration);
    this._engine.setTime(this.time);
    this._propagateEngine();

    return this;
  }

  engine(): AnimationEngine<TRoot, TTrack> | undefined {
    return this._engine;
  }

  private _updateTime(t: number): void {
    this.time = t;
    this._engine?.setTime(t);
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
    if (!this._engine) return;
    // Auto-propagate engine events
    this._engine.on('clipAdded', (e) => this.trigger('clipAdded', e));
    this._engine.on('clipRemoved', (e) => this.trigger('clipRemoved', e));
    this._engine.on('clipUpdated', (e) => this.trigger('clipUpdated', e));

    this._engine.on('switchActive', ({ clip, oldClip }) => {
      if (oldClip) {
        oldClip.disposeAll();
      }

      this.setDuration(clip.duration);
      this.stop();

      clip.on('trackAdd', (e) => this.trigger('trackAdd', e));
      clip.on('trackRemove', (e) => this.trigger('trackRemove', e));
      clip.on('trackUpdate', (e) => this.trigger('trackUpdate', e));
      this.trigger('switchActive', { clip, oldClip });
    });

    this._engine.on('rootChange', (e) => this.trigger('rootChange', e));
    this._engine.on('timeUpdate', (e) => this.trigger('timeUpdate', e));
  }
}
