import type { AnimationAction, Object3D } from 'three';
import type { FunctionKeyframeTrack } from './FunctionKeyframeTrack';
import { generateEventTracks, type AnimationEvent } from '../utils/track.utils';

export class TrackEventManager {
  private events: AnimationEvent[] = [];

  registerTracks(tracks: FunctionKeyframeTrack[], action: AnimationAction) {
    const _events = generateEventTracks(tracks, action);
    if (_events.length > 0) {
      this.events.push(..._events);
    }
  }

  trigger(event: AnimationEvent) {
    const { name, action, args } = event;

    const root: Object3D = action.getRoot();
    if (!root) return;

    const fn: Function = root[name as keyof Object3D] as Function;

    if (fn instanceof Function) {
      try {
        fn.apply(root, [...args, event]);
      } catch (error) {
        console.error(`[EventTrackManager] Error on '${event.name}' execution:`, error);
      }
    } else {
      console.warn(`[EventTrackManager] Function '${event.name}' does not exist in root.`);
    }
  }

  reset(time: number) {
    this.events.forEach((event) => {
      event.frame.lastTime = time;
    });
  }

  update() {
    this.events.forEach((event) => {
      const frameTime = event.frame.time;
      const lastTime = event.frame.lastTime;
      const time = event.action.time;
      const dir = time <= 0 ? 0 : time - lastTime;

      if (dir > 0 && lastTime < frameTime && frameTime <= time) {
        this.trigger(event);
      } else if (dir < 0 && lastTime > frameTime && frameTime >= time) {
        this.trigger(event);
      }

      event.frame.lastTime = time;
    });
  }
}
