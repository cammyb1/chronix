import { AnimationAction, AnimationClip, Object3D, type KeyframeTrack } from 'three';
import { EventBus } from '../core/EventBus';
import TimeLineUI from '../ui/TimeLineUI';
import { AnimationMixerPlus } from '../core/AnimationMixerPlus';

export interface ATLEvents {
  timeupdate: { time: number };
}

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  protected root: T;
  protected ui: TimeLineUI;
  protected clip: AnimationClip;
  protected mixer: AnimationMixerPlus;

  private _action: AnimationAction;

  private timeScale: number = 1;
  private running: boolean = false;

  constructor(r?: T, ui?: TimeLineUI) {
    super();
    this.clip = new AnimationClip('test', -1, []);
    this.ui = ui || new TimeLineUI();
    this.root = r || (new Object3D() as T);

    this.mixer = new AnimationMixerPlus(this.root);
    this._action = this.mixer.clipAction(this.clip);
    this._action.play();

    this.ui.on('timeupdate', (e) => {
      this.setTime(e.time);
    });

    this.ui.on('play', () => this.start());
    this.ui.on('pause', () => this.pause());
    this.ui.on('stop', () => this.stop());
  }

  attachUI(ui: TimeLineUI) {
    if (this.ui.dom.parentNode) {
      this.ui.dom.parentNode.removeChild(this.ui.dom);
    }
    this.ui = ui;
    this.ui.removeTracks().registerTracks(this.clip.tracks);
  }

  setTimeScale(v: number) {
    this.timeScale = v;
    this.ui.setScale(v);
    this.resetDuration();
  }

  get dom(): HTMLElement {
    return this.ui.dom;
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
    this.ui.setDuration(this.clip.duration);
    this.setDuration(this.clip.duration);
  }

  setDuration(dur: number): this {
    this.clip.duration = dur;
    this.ui.setDuration(dur);
    return this;
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
    this.ui.removeTracks().registerTracks(this.clip.tracks);
    this.resetDuration();
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
    this.ui.setTime(this._action.time);
  }

  stop(): this {
    this.setTime(0);
    this.running = false;
    return this;
  }

  setTime(t: number) {
    this.mixer.setTime(t);
    this.ui.setTime(t);
  }
}
