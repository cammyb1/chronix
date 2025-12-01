import type { KeyframeTrack, Object3D } from 'three';
import { EventBus } from '../core/EventBus';
import TimeLineUI from '../ui/TimeLineUI';

export interface ATLEvents { timeupdate: { time: number } }

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  duration: number;
  ui: TimeLineUI;
  tracks: KeyframeTrack[];
  root: T | undefined;

  running: boolean = false;
  time: number = 0;

  constructor(ui: TimeLineUI = new TimeLineUI()) {
    super();
    this.duration = 0;
    this.tracks = [];
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
    this.ui.removeTracks().registerTracks(this.tracks);
  }

  get dom(): HTMLElement {
    return this.ui.dom;
  }

  attach(target: T): this {
    this.root = target;
    return this;
  }

  resetDuration() {
    let maxTime = -Infinity;
    this.tracks.forEach((t: KeyframeTrack) => {
      const { times } = t;
      times.forEach((ut) => {
        if (ut > maxTime) maxTime = ut;
      });
    });
    this.setDuration(maxTime);
  }

  setDuration(dur: number): this {
    this.duration = dur;
    this.ui.setDuration(dur);
    return this;
  }

  forward(time: number): this {
    this.time += time;
    if (this.time > this.duration) {
      this.time = this.duration;
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
    this.tracks = tracks;
    this.resetDuration();
    this.ui.removeTracks().registerTracks(this.tracks);
  }

  clear() {
    this.tracks = [];
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
