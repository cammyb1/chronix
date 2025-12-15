import { AnimationAction, AnimationClip, KeyframeTrack, Object3D } from 'three';
import { AnimationEngine } from './AnimationEngine';
import { AnimationMixerPlus } from '../three/AnimationMixerPlus';

export class ThreeAnimationEngine extends AnimationEngine<Object3D, KeyframeTrack> {
  protected mixer: AnimationMixerPlus;
  private _action: AnimationAction;

  constructor(r?: Object3D) {
    super(r || new Object3D());
    this.mixer = new AnimationMixerPlus(this.root);
    this._action = this.mixer.clipAction(new AnimationClip('clip', -1, []));
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

  addTrack(track: KeyframeTrack): void {
    super.addTrack(track);
    this.refreshTracks();
  }

  removeTrack(track: KeyframeTrack): void {
    super.removeTrack(track);
    this.refreshTracks();
  }

  updateTrack(index: number, track: KeyframeTrack): void {
    super.updateTrack(index, track);
    this.refreshTracks();
  }

  clearTracks(): void {
    super.clearTracks();
    this.refreshTracks();
  }

  getAction(): AnimationAction {
    return this._action;
  }

  getMixer(): AnimationMixerPlus {
    return this.mixer;
  }

  refreshTracks() {
    if (this._action) {
      this.mixer.uncacheAction(this._action.getClip());
      this.mixer.uncacheClip(this._action.getClip());
    }
    this._action = this.mixer.clipAction(
      new AnimationClip('clip', -1, Array.from(this.tracks.values())),
    );
    const duration = this._action.getClip().duration;
    this._action.play();
    this.setDuration(duration);
  }

  setTime(n: number) {
    this.mixer.setTime(n);
    super.setTime(n);
  }

  setDuration(dur: number): void {
    const clip = this._action.getClip();
    clip.duration = dur;
    this._action.setDuration(dur);
    super.setDuration(dur);
  }
}
