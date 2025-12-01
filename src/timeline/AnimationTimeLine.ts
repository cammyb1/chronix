import { AnimationClip, type KeyframeTrack, type Object3D } from 'three';
import { EventBus } from '../core/EventBus';
import TimeLineUI from '../ui/TimeLineUI';

export interface ATLEvents {
  timeupdate: { time: number };
}

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  ui: TimeLineUI;
  clip: AnimationClip;
  root: T | undefined;

  running: boolean = false;
  time: number = 0;
  timeScale: number = 1;

  constructor(ui: TimeLineUI = new TimeLineUI()) {
    super();
    this.clip = new AnimationClip('test', -1, []);
    this.ui = ui;

    this.ui.on('timeupdate', (e) => {
      this.setTime(e.time);
      this.trigger('timeupdate', { time: this.time });
    });
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
    this.root = target;
    return this;
  }

  resetDuration() {
    this.clip.resetDuration();
    this.setDuration(this.clip.duration);
  }

  setDuration(dur: number): this {
    this.clip.duration = dur;
    this.ui.setDuration(dur);
    return this;
  }

  forward(time: number): this {
    this.time += time;
    if (this.time > this.clip.duration) {
      this.time = this.clip.duration;
    }

    return this;
  }

  backward(time: number): this {
    this.time -= time;
    if (this.time < 0) {
      this.time = 0;
    }

    return this;
  }

  fromArray(tracks: KeyframeTrack[]) {
    this.clip = new AnimationClip('test', -1, tracks);
    this.ui.removeTracks().registerTracks(this.clip.tracks);
    this.resetDuration();
  }

  clear() {
    this.clip.tracks = [];
    this.time = 0;
  }

  start(): this {
    this.running = true;
    return this;
  }

  stop(): this {
    this.time = 0;
    this.running = false;
    return this;
  }

  setTime(t: number) {
    this.time = t;
  }
}
