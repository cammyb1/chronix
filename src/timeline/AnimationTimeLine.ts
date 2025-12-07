import { AnimationAction, AnimationClip, Object3D, type KeyframeTrack } from 'three';
import { EventBus } from '../core/EventBus';
import { AnimationMixerPlus } from '../core/AnimationMixerPlus';

export interface ATLEvents {
  timeupdate: { time: number };
  updateProps: null;
}

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  protected root: T;
  protected clip: AnimationClip;
  protected mixer: AnimationMixerPlus;

  private _action: AnimationAction;

  private running: boolean = false;

  constructor(r?: T) {
    super();
    this.clip = new AnimationClip('test', -1, []);
    this.root = r || (new Object3D() as T);
    this.mixer = new AnimationMixerPlus(this.root);
    this._action = this.mixer.clipAction(this.clip);
    this._action.play();
  }

  attach(target: T): this {
    if (this.root !== target) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.root as Object3D);
    }
    this.root = target;
    return this;
  }

  resetDuration() {
    this.clip.resetDuration();
    this.setDuration(this.clip.duration);
  }

  setDuration(dur: number): this {
    this.clip.duration = dur;
    if (this._action) {
      this._action.setDuration(dur);
    }
    return this;
  }

  fromClip(clip: AnimationClip) {
    this.fromArray(clip.tracks);
  }

  fromArray(tracks: KeyframeTrack[]) {
    if (this._action) {
      this._action.stop();
      this.mixer.uncacheAction(this.clip);
      this.mixer.uncacheClip(this.clip);
    }

    this.clip = new AnimationClip('clip', -1, tracks);
    this._action = this.mixer.clipAction(this.clip);
    this._action.play();
    this.resetDuration();

    this.trigger('updateProps');
  }

  getDuration(): number {
    return this.clip.duration;
  }

  getTracks(): KeyframeTrack[] {
    return this.clip.tracks;
  }

  clear() {
    this.clip.tracks = [];
  }

  start(): this {
    this.running = true;
    return this;
  }

  pause(): this {
    this.running = false;
    return this;
  }

  update(dt: number) {
    if (!this.running) return;
    this.mixer.update(dt);
  }

  getTime(): number {
    return this.mixer.time;
  }

  stop(): this {
    this.setTime(0);
    this.running = false;
    return this;
  }

  setTime(t: number) {
    this.mixer.setTime(t);
  }
}
