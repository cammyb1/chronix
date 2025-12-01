import { AnimationClip, type KeyframeTrack, type Object3D } from 'three';
import { EventBus } from '../core/EventBus';
import TimeLineUI from '../ui/TimeLineUI';

export interface ATLEvents { timeupdate: { time: number } }

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  ui: TimeLineUI;
  clip: AnimationClip;
  root: T | undefined;

  running: boolean = false;
  time: number = 0;

  constructor(ui: TimeLineUI = new TimeLineUI()) {
    super();
    this.clip = new AnimationClip('test', -1, []);
    this.ui = ui;

    this.ui.on('timeupdate', (e) => {
      this.time = e.time;
      this.trigger('timeupdate', e);
    });
  }

  attachUI(ui: TimeLineUI) {
    if (this.ui.dom.parentNode) {
      this.ui.dom.parentNode.removeChild(this.ui.dom);
    }
    this.ui = ui;
    this.ui.removeTracks().registerTracks(this.clip.tracks);
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
    this.clip.tracks = tracks;
    this.resetDuration();
    this.ui.removeTracks().registerTracks(this.clip.tracks);
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
