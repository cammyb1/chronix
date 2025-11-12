import type { AnimationClip, KeyframeTrack, Object3D } from 'three';
import { EventBus } from '../core/EventBus';
import { AnimationTrack } from './AnimationTrack';
import { TimeLineUI } from '../ui/ui.manager';

export interface ATLEvents {}

export class AnimationTimeLine<T extends Object3D> extends EventBus<ATLEvents> {
  duration: number;
  ui: TimeLineUI;
  tracks: Array<{ order: number; track: AnimationTrack }>;
  root: T | undefined;

  running: boolean = false;
  time: number = 0;

  constructor() {
    super();
    this.duration = 0;
    this.tracks = [];
    this.ui = new TimeLineUI();
  }

  get dom(): HTMLElement {
    return this.ui.dom;
  }

  attach(target: T): this {
    this.root = target;
    return this;
  }

  append(track: KeyframeTrack): this {
    if (!this.tracks.find((t) => t.track.root === track)) {
      this.tracks.push({ order: this.tracks.length - 1, track: new AnimationTrack(track) });
    }

    return this;
  }

  setDuration(dur: number): this {
    this.duration = dur;
    return this;
  }

  forward(time: number): this {
    this.time += time;

    return this;
  }

  backward(time: number): this {
    if (this.time - time < 0) this.time = 0;
    this.time -= time;

    return this;
  }

  clear() {
    this.tracks = [];
  }

  start(): this {
    this.time = 0;
    this.running = true;
    return this;
  }

  stop(): this {
    this.time = 0;
    this.running = false;
    return this;
  }

  update(dt: number) {
    if (this.running) {
      this.time += dt;

      if (this.time >= this.duration) {
        this.time = 0;
      }
    }
  }

  import(clip: AnimationClip) {
    clip.tracks.forEach((track) => this.append(track));
    this.duration = clip.duration;
  }

  export() {}
}
