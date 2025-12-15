import {
  type AnimationAction,
  BooleanKeyframeTrack,
  KeyframeTrack,
  ColorKeyframeTrack,
  NumberKeyframeTrack,
  QuaternionKeyframeTrack,
  StringKeyframeTrack,
  VectorKeyframeTrack,
} from 'three';
import type { IAnimationEvent } from '../types';
import { FunctionKeyframeTrack } from '../3js/FunctionKeyframeTrack';

export enum Keyframes {
  BOOLEAN = 0,
  COLOR = 1,
  NUMBER = 2,
  QUAT = 3,
  STRING = 4,
  VECTOR = 5,
  FUNC = 6,
}

export function getTrackByType(name: Keyframes) {
  switch (name) {
    case Keyframes.BOOLEAN:
      return BooleanKeyframeTrack;
    case Keyframes.COLOR:
      return ColorKeyframeTrack;
    case Keyframes.NUMBER:
      return NumberKeyframeTrack;
    case Keyframes.STRING:
      return StringKeyframeTrack;
    case Keyframes.FUNC:
      return FunctionKeyframeTrack;
    case Keyframes.QUAT:
      return QuaternionKeyframeTrack;
    case Keyframes.VECTOR:
      return VectorKeyframeTrack;
    default:
      return KeyframeTrack;
  }
}

export function generateEventTracks(tracks: FunctionKeyframeTrack[], action: AnimationAction) {
  const events: IAnimationEvent[] = [];

  if (!action.getRoot()) return [];

  tracks.forEach((track) => {
    const times = track.times;
    const values = track.values;

    for (let i = 0; i < times.length; i++) {
      const raw = values[i].toString().trim();
      const currentTime = times[i];

      if (raw === '') continue;

      const event: IAnimationEvent = {
        action,
        name: '',
        args: [],
        frame: {
          time: currentTime,
          lastTime: action.time,
        },
      };

      if (raw.includes(':')) {
        const [name, args] = raw.split(':');
        event.name = name;
        event.args = args.split(',').map((arg) => arg.trim());
        events.push(event);
      } else {
        const name = raw;
        event.name = name;
        events.push(event);
      }
    }
  });

  return events;
}
