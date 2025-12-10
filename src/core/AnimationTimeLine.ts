import { AnimationAction, AnimationClip, Object3D, type KeyframeTrack } from 'three';
import { EventBus } from './EventBus';
import { AnimationMixerPlus } from './AnimationMixerPlus';

export interface ATLEvents {
  timeupdate: { time: number };
  updateProps: null;
}

export class AnimationTimeLine<T extends Object3D = Object3D> extends EventBus<ATLEvents> {
  protected root: T;
  protected clip: AnimationClip;
  protected mixer: AnimationMixerPlus;

  private _action: AnimationAction | undefined;
  private running: boolean = false;

  constructor(r?: T) {
    super();
    this.clip = new AnimationClip('test', -1, []);
    this.root = r || (new Object3D() as T);
    this.mixer = new AnimationMixerPlus(this.root);
    this._bindAction();
  }

  private _bindAction() {
    if (this._action) {
      this._action.stop();
      this.mixer.uncacheAction(this._action.getClip());
      this.mixer.uncacheClip(this._action.getClip());
    }
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

  setDuration(dur: number): this {
    this.clip.duration = dur;
    if (this._action) {
      this._action.getClip().duration = dur;
    }

    this.trigger('updateProps');
    return this;
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

  play(): this {
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
    this.trigger('timeupdate', { time: this.mixer.time });
  }

  getActionTime(): number {
    return this._action?.time || 0;
  }

  getTime(): number {
    return this.mixer.time;
  }

  isRunning(): boolean {
    return this.running;
  }

  stop(): this {
    this.setTime(0);
    this.running = false;
    return this;
  }

  setTime(t: number) {
    this.mixer.setTime(t);
    this.trigger('timeupdate', { time: this.mixer.time });
  }

  fromClip(clip: AnimationClip) {
    this.fromArray(clip.tracks);
  }

  fromArray(tracks: KeyframeTrack[]) {
    this.clip = new AnimationClip('clip', -1, tracks);
    this._bindAction();

    this.trigger('updateProps');
  }
}
