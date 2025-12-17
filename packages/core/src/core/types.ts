import type { AnimationAction } from 'three';
import type AnimationPlayer from './AnimationPlayer';
import type { UIElement } from './ui/components/BaseUI';
import type { AnimationEngine } from './AnimationEngine';

export interface TrackLike {
  name: string;
  times: number[];
  values: TypedValue[];
  interpolation?: Interpolation;
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
  root: any
}

export interface ITrackManager {
  addTrack(track: object): void;
  updateTrack(index: number, track: object): void;
  removeTrack(track: object): void;
  getTracksByName(name: string): object[];
  getTracksByProperty<K extends string>(key: K, value: any): object[];
  filterTracks(predicate: (track: object) => boolean): object[];
  hasTrack(track: object): boolean;
  getTracks(): object[];
  clearTracks(): void;
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
