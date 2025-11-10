import type { AnimationAction } from 'three';
import type { FunctionKeyframeTrack } from './FunctionKeyframeTrack';
import { generateEventTracks, type AnimationEvent } from '../utils/track.utils';

export class EventManager {
  private events: AnimationEvent[] = [];

  registerTracks(tracks: FunctionKeyframeTrack[], action: AnimationAction) {
    const _events = generateEventTracks(tracks, action);
    if (_events.length > 0) {
      this.events.push(..._events);
    }
  }

  private trigger(event: AnimationEvent) {
    const { name, action, args } = event;

    const root = action.getRoot();
    if (!root) return;
    const fn = (root as any)[name];

    if (typeof fn === 'function') {
      try {
        fn.apply(root, [...args, event]);
      } catch (error) {
        console.error(`[EventTrackManager] Error ejecutando '${event.raw}':`, error);
      }
    } else {
      console.warn(`[EventTrackManager] La función '${event.name}' no existe en root.`);
    }
  }

  update(dt: number) {
    this.events.forEach((event) => {
      const frameTime = event.frame.time;
      const time = event.action.time;
      const futureTime = time + dt;

      if (futureTime >= frameTime && event.frame.lastTime < frameTime) {
        this.trigger(event);
      }

      event.frame.lastTime = time;
    });
  }
}
