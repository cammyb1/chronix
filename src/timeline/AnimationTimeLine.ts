import type { KeyframeTrack } from 'three';
import { EventBus } from '../core/EventBus';

export interface ATLEvents {
  tick: { dt: number };
}

export class AnimationTimeLine<T = undefined> extends EventBus<ATLEvents> {
  duration: number;
  container: HTMLElement;
  tracks: KeyframeTrack[];
  root: T | undefined;

  constructor(container?: HTMLElement) {
    super();
    this.duration = 0;
    this.tracks = [];

    if (container) {
      this.container = container;
    } else {
      this.container = document.createElement('div');
      document.appendChild(this.container);
    }
  }

  bind(target: T): this {
    this.root = target;
    return this;
  }

  dispose() {
    this.container.parentNode?.removeChild(this.container);
  }

  setDuration(dur: number): this {
    this.duration = dur;
    return this;
  }

  update(dt: number) {
    this.trigger({ type: 'tick', dt });
  }

  // TODO: Create timeline from existing clip
  import() {}
  export() {}
}
