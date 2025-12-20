import { EventBus } from './EventBus';
import { VanillaAnimationEngine } from './engines/VanillaAnimationEngine';
import { AnimationEngine } from './AnimationEngine';
import type { AnimationPlayerConfig, IAnimationEvents, TrackLike } from './types';
import type Clip from './Clip';

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

  protected engine: AnimationEngine<TRoot, TTrack> | undefined;

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
    this.engine?.active()?.setDuration(dur);
    return this;
  }

  getDuration(): number {
    return this.duration;
  }

  clear(): void {
    this.engine?.active()?.clearTracks();
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

  clips(): Clip<TTrack>[] {
    return this.engine?.clips || [];
  }

  tracks(): TTrack[] {
    return this.engine?.active()?.getTracks() || [];
  }

  add(track: TTrack): TTrack | undefined {
    return this.engine?.active()?.addTrack(track);
  }

  remove(track: TTrack): TTrack | undefined {
    return this.engine?.active()?.removeTrack(track);
  }

  createClip(name: string, array: TTrack[]): Clip<TTrack> | undefined {
    return this.engine?.createClip(name, array);
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

    this.engine = intance;
    this.engine.active()?.setDuration(this.duration);
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
    this.engine.on('clipAdded', (e) => this.trigger('clipAdded', e));
    this.engine.on('clipRemoved', (e) => this.trigger('clipRemoved', e));
    this.engine.on('clipUpdated', (e) => this.trigger('clipUpdated', e));

    this.engine.on('switchActive', ({ clip, oldClip }) => {
      if (oldClip) {
        oldClip.disposeAll();
      }

      clip.on('trackAdd', (e) => this.trigger('trackAdd', e));
      clip.on('trackRemove', (e) => this.trigger('trackRemove', e));
      clip.on('trackUpdate', (e) => this.trigger('trackUpdate', e));
      this.trigger('switchActive', { clip, oldClip });
    });

    this.engine.on('rootChange', (e) => this.trigger('rootChange', e));
    this.engine.on('timeUpdate', (e) => this.trigger('timeUpdate', e));
    this.engine.on('durationChange', (e) => {
      this.duration = e.duration;
      this.trigger('durationChange', e);
    });
  }
}
