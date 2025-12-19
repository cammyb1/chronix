import type { AnimationAction } from 'three';
import type AnimationPlayer from './AnimationPlayer';
import type { UIElement } from './ui/components/BaseUI';
import type { AnimationEngine } from './AnimationEngine';
import type TrackManager from './TrackManager';

export interface TrackLike {
  name: string;
  times: ArrayLike<number>;
  values: ArrayLike<TypedValue>;
  interpolation?: Interpolation;
}

export interface IClip<ITrack extends TrackLike = TrackLike> {
  id?: string;
  name: string;
  duration: number;
  tracks: TrackManager<ITrack>;
}

export type TypedValue = string | number | boolean;

export enum Interpolation {
  LINEAR = 0,
  DISCRETE = 1,
}

export type ChangeEvent<T extends EventTarget = HTMLElement> = {
  target: T;
};

export interface IThreeExampleEvents {
  resize: {};
  tick: { dt: number; elapsed: number };
}

export interface AnimationPlayerConfig {
  duration?: number;
  loop?: boolean;
  autoStart?: boolean;
  timeScale?: number;
  startTime?: number;
  engine?: AnimationEngine<any, any> | string;
  root: any;
}

export interface ITrackEvents {
  // Track events
  trackAdded: { track: TrackLike & any };
  trackRemoved: { track: TrackLike & any };
  trackUpdated: { track: TrackLike & any };
}

export interface IAnimationEvents<IRoot, ITrack extends TrackLike = TrackLike> {
  // Playback events
  play: null;
  pause: null;
  stop: null;

  // Time events
  timeUpdate: { time: number };

  // Duration events
  durationChange: { duration: number };

  // Clip events
  clipAdded: { clip: IClip<ITrack> };
  clipRemoved: { clip: IClip<ITrack> };
  clipUpdated: { clip: IClip<ITrack> };

  // Root events
  rootChange: { root: IRoot };
}

export interface IRulerEvent {
  timeupdate: { time: number };
}

export default interface TimeUIPlugin<T extends UIElement = UIElement> {
  name: string;
  onAdd?(): void;
  onMount?(): void;
  onDismount?(): void;
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
