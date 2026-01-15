import type { AnimationAction } from 'three';
import type { UIElement } from './ui/components/BaseUI';
import type Clip from './Clip';
import type AnimationPlayer from './AnimationPlayer';
import type UIPlugin from './ui/plugins/UIPlugin';

export interface TrackLike {
  name: string;
  times: ArrayLike<number> | Float32Array;
  values: ArrayLike<TypedValue>;
  interpolation?: Interpolation;
}

export interface ClipConfig<ITrack> {
  duration?: number;
  name: string;
  loop?: boolean;
  tracks?: ITrack[];
}

export interface ModalInputData {
  [key: string]: string | number | boolean;
}

export interface ModalInputItem {
  label: string;
  value: string;
  placeHolder: string;
  type: string;
  min?: string,
  max?: string
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

export interface ITrackEvents<Track extends TrackLike = TrackLike> {
  // Track events
  trackAdded: { track: Track; clip: Clip<Track> };
  trackRemoved: { track: Track; clip: Clip<Track> };
  trackUpdated: { track: Track; clip: Clip<Track> };
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
  switchActive: { clip: Clip<ITrack>; oldClip: Clip<ITrack> | undefined };
  clipAdded: { clip: Clip<ITrack> };
  clipRemoved: { clip: Clip<ITrack> };
  clipUpdated: { clip: Clip<ITrack> };

  // Root events
  rootChange: { root: IRoot };
}

export interface IRulerEvent {
  timeupdate: { time: number };
}

export interface IPluginConstructor {
  new (player: AnimationPlayer, parent: HTMLElement): UIPlugin;
}

export default interface IPlugin<T extends UIElement> {
  init?(): void;
  onMount?(): void;
  onDismount?(): void;
  dispose?(): void;
  render?(): T | undefined;
}

export interface ITrackControlEvents {
  updateDuration: { value: number };
  updateName: { value: string };
  addClip: null;
  play: null;
  pause: null;
  stop: null;
  restart: null;
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
