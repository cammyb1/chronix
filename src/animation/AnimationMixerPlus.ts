import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  AnimationObjectGroup,
  type AnimationBlendMode,
  type Object3D,
} from 'three';
import { FunctionKeyframeTrack } from './FunctionKeyframeTrack';

export type AnimationEvent = {
  action: AnimationAction;
  time: number;
  lastTime: number;
  name: string;
  raw: string;
  args: string[];
  triggered: boolean;
};

export class AnimationMixerPlus extends AnimationMixer {
  private events: AnimationEvent[] = [];
  constructor(root: Object3D | AnimationObjectGroup) {
    super(root);
  }

  private generateEventsFromTracks(action: AnimationAction, tracks: FunctionKeyframeTrack[]) {
    tracks.forEach((track) => {
      const times = track.times;
      const values = track.values;

      for (let i = 0; i < times.length; i++) {
        const raw = values[i].toString().trim();
        const currentTime = times[i];

        if (raw == '') continue;

        const root = this.getRoot();
        if (!root) return;

        if (raw.includes(':')) {
          const [name, args] = raw.split(':');
          if (name in root) {
            this.events.push({
              action,
              time: currentTime,
              lastTime: 0,
              name,
              raw,
              args: args.split(',').map((arg) => arg.trim()),
              triggered: false,
            });
          }
        } else {
          const name = raw;

          if (name in root) {
            this.events.push({
              action,
              time: currentTime,
              lastTime: 0,
              name,
              raw,
              args: [],
              triggered: false,
            });
          }
        }
      }
    });
  }

  private triggerEvent(event: AnimationEvent) {
    const name = event.name;
    const args = event.args;
    const root = this.getRoot(); // This doew not work with optionalRoot

    const fn = (root as any)[name];

    if (typeof fn === 'function') {
      try {
        fn.apply(root, args);
      } catch (error) {
        console.error(`[EventTrackManager] Error ejecutando '${event.raw}':`, error);
      }
    } else {
      console.warn(`[EventTrackManager] La función '${event.name}' no existe en root.`);
    }
  }

  private updateEvents() {
    this.events.forEach((event) => {
      if (event.action.time >= event.time && !event.triggered) {
        this.triggerEvent(event);
        event.triggered = true;
      }

      if (event.action.time < event.time) {
        event.triggered = false;
      }

      event.lastTime = event.action.time;
    });
  }

  override update(dt: number): this {
    super.update(dt);
    this.updateEvents();
    return this;
  }

  override clipAction(
    clip: AnimationClip,
    optionalRoot?: Object3D,
    blendMode?: AnimationBlendMode,
  ): AnimationAction {
    const action = super.clipAction(clip, optionalRoot, blendMode);
    if (clip.tracks.find((t) => t instanceof FunctionKeyframeTrack)) {
      const fnTracks = clip.tracks.filter((t) => t instanceof FunctionKeyframeTrack);
      this.generateEventsFromTracks(action, fnTracks);
    }
    return action;
  }
}
