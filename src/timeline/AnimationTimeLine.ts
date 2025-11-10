import type { KeyframeTrack } from 'three';
import { EventBus } from '../core/EventBus';

export interface ATLEvents {
  tick: { dt: number };
}

export class AnimationTimeLine extends EventBus<ATLEvents> {
  duration: number;
  tracks: KeyframeTrack[];

  constructor() {
    super();

    this.duration = 0;
    this.tracks = [];
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
