import type { KeyframeTrack } from 'three';
import { EventBus } from '../core/EventBus';

export interface ATLEvents {
  tick: { dt: number };
}

const div = document.createElement('div');
div.className = 'timeline-container';

export class AnimationTimeLine<T = undefined> extends EventBus<ATLEvents> {
  duration: number;
  dom: HTMLElement;
  tracks: KeyframeTrack[];
  root: T | undefined;

  constructor(container?: HTMLElement) {
    super();
    this.duration = 0;
    this.tracks = [];
    this.dom = div;

    if (container) {
      container.appendChild(this.dom);
    } else {
      document.body.appendChild(this.dom);
    }
  }

  bind(target: T): this {
    this.root = target;
    return this;
  }

  dispose() {
    this.dom.parentNode?.removeChild(this.dom);
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
