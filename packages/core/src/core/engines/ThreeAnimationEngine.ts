import { AnimationAction, AnimationClip, KeyframeTrack, Object3D } from 'three';
import { AnimationEngine } from '../AnimationEngine';
import { AnimationMixerPlus } from '../../three/AnimationMixerPlus';
import type { IClip } from '../types';

export class ThreeAnimationEngine extends AnimationEngine<Object3D, KeyframeTrack> {
  protected mixer: AnimationMixerPlus;
  private clipMap: { [k: string]: AnimationClip };
  private _actions: Map<string, AnimationAction[]>;

  constructor(r?: Object3D) {
    super(r || new Object3D());
    this.mixer = new AnimationMixerPlus(this.root);
    this.clipMap = {};
    this._actions = new Map();
  }

  createClip(name: string, array?: KeyframeTrack[]): IClip<KeyframeTrack> {
    const clip = new AnimationClip(name, -1, array || []);
    this.clipMap[clip.uuid] = clip;

    if (!this._actions.get(clip.uuid)) {
      this._actions.set(clip.uuid, [this.mixer.clipAction(clip)]);
    }

    return super.createClip(name, array);
  }

  setRoot(r: Object3D): void {
    if (this.root) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.root);
    }
    this.root = r;
    this.mixer = new AnimationMixerPlus(r);
    super.setRoot(r);
  }

  getMixer(): AnimationMixerPlus {
    return this.mixer;
  }

  setTime(n: number) {
    this.mixer.setTime(n);
    super.setTime(n);
  }
}
