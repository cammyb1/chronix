import type { AnimationAction } from 'three';
import type { AnimationPlayer } from './AnimationPlayer';
import type { UIElement } from '../ui/components/BaseUI';
import type { AnimationEngine } from './engines/AnimationEngine';

export interface IThreeExampleEvents {
  resize: {};
  tick: { dt: number; elapsed: number };
}

export interface AnimationPlayerConfig {
  duration?: number;
  loop?: boolean;
  timeScale?: number;
  startTime?: number;
  engine?: AnimationEngine<any, any>;
}

export interface IAnimationEvents<IRoot, ITrack> {
  // Playback events
  play: null;
  pause: null;
  stop: null;

  // Time events
  timeUpdate: { time: number };

  // Duration events
  durationChange: { duration: number };

  // Track events
  trackAdd: { track: ITrack };
  trackRemove: { track: ITrack };
  trackUpdate: { track: ITrack };

  // Root events
  rootChange: { root: IRoot };
}

export interface IRulerEvent {
  timeupdate: { time: number };
}

export default interface TimeUIPlugin<T extends UIElement = UIElement> {
  name: string;
  init?(): void;
  onAttach?(parent: AnimationPlayer): void;
  onDetach?(parent: AnimationPlayer): void;
  exit?(): void;
  render(): T;
}

export interface ITrackControlEvents {
  updateDuration: { value: number };
  updateName: { value: string };
  play: null;
  pause: null;
  stop: null;
}

export interface IAnimationEvent {
  action: AnimationAction;
  name: string;
  args: Array<string>;
  frame: {
    time: number;
    lastTime: number;
  };
}
