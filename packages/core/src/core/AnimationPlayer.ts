import { EventBus } from './EventBus';
import { VanillaAnimationEngine } from './engines/VanillaAnimationEngine';
import { AnimationEngine } from './AnimationEngine';
import { ThreeAnimationEngine } from './engines/ThreeAnimationEngine';
import type { IAnimationEvents, TrackLike } from './types';

export default class AnimationPlayer<
  TRoot = any,
  TTrack extends TrackLike = TrackLike,
> extends EventBus<IAnimationEvents<TRoot, TTrack>> {
  protected running: boolean = false;

  protected static engines: Map<string, new (...args: any[]) => AnimationEngine<any, any>> =
    new Map();

  static {
    this.registerEngine('vanilla', VanillaAnimationEngine);
    this.registerEngine('three', ThreeAnimationEngine);
  }

  static registerEngine(
    name: string,
    engineClass: new (...args: any[]) => AnimationEngine<any, any>,
  ) {
    this.engines.set(name, engineClass);
  }

  protected _engine: AnimationEngine<TRoot, TTrack> | undefined;

  constructor(config: { root?: TRoot } = {}) {
    super();

    if (config.root) {
      this.setEngine('vanilla', config.root);
    }
  }

  setDuration(dur: number): this {
    this._engine?.active?.setDuration(dur);
    this.trigger('durationChange', { duration: dur });
    return this;
  }

  getDuration(): number {
    return this._engine?.active?.getDuration() || 0;
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
    return this.engine()?.time || 0;
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
    this._propagateEngine();

    return this;
  }

  engine(): AnimationEngine<TRoot, TTrack> | undefined {
    return this._engine;
  }

  update(dt: number): void {
    if (!this.running || !this._engine) return;
    const active = this._engine.active;
    if (!active) return;

    const duration = active.getDuration();

    let time = this._engine?.time + dt || 0;
    if (!active?.loop && time > duration) {
      time = duration;
      this.pause();
    } else if (time > duration) {
      time = 0;
    }

    this._engine?.setTime(time);
  }

  seek(t: number) {
    if (!this._engine) return;
    const active = this._engine.active;
    if (!active) return;
    if (t < 0 || t > active.getDuration()) {
      throw new Error(`Time must be between 0 and ${active.getDuration()}`);
    }
    this._engine?.setTime(t);
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
