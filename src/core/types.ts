import type { AnimationAction } from 'three';
import type { AnimationPlayer } from './AnimationPlayer';
import type { UIElement } from '../ui/components/BaseUI';

export interface IThreeExampleEvents {
  resize: {};
  tick: { dt: number; elapsed: number };
}

export interface IRulerEvent {
  timeupdate: { time: number };
}

export default interface ITimeUIPlugin<T extends UIElement = UIElement> {
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
