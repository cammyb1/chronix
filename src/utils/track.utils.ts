import type { AnimationAction } from 'three';
import type { FunctionKeyframeTrack } from '../animation/FunctionKeyframeTrack';

export interface AnimationEvent {
  action: AnimationAction;
  name: string;
  args: Array<string>;
  frame: {
    time: number;
    lastTime: number;
  };
}

export function generateEventTracks(tracks: FunctionKeyframeTrack[], action: AnimationAction) {
  const events: AnimationEvent[] = [];

  if (!action.getRoot()) return [];

  tracks.forEach((track) => {
    const times = track.times;
    const values = track.values;

    for (let i = 0; i < times.length; i++) {
      const raw = values[i].toString().trim();
      const currentTime = times[i];

      if (raw === '') continue;

      const root = action.getRoot();

      const event: AnimationEvent = {
        action,
        name: '',
        args: [],
        frame: {
          time: currentTime,
          lastTime: 0,
        },
      };

      if (raw.includes(':')) {
        const [name, args] = raw.split(':');
        if (name in root) {
          event.name = name;
          event.args = args.split(',').map((arg) => arg.trim());
          events.push(event);
        }
      } else {
        const name = raw;
        if (name in root) {
          event.name = name;
          events.push(event);
        }
      }
    }
  });

  return events;
}
