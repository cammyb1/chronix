import { AnimationAction, AnimationClip, KeyframeTrack, Object3D } from 'three';
import { AnimationEngine } from '../AnimationEngine';
import { AnimationMixerPlus } from '../../three/AnimationMixerPlus';
import type Clip from '../Clip';

export class ThreeAnimationEngine extends AnimationEngine<Object3D, KeyframeTrack> {
  protected mixer: AnimationMixerPlus;
  private _activeAction: AnimationAction | undefined;

  constructor(r?: Object3D) {
    super(r || new Object3D());
    this.mixer = new AnimationMixerPlus(this.root);
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

  _updateAction(clip: Clip<KeyframeTrack>) {
    this._uncacheActiveAction();

    const aclip = new AnimationClip(clip.name, clip.duration, clip.getTracks());
    this._activeAction = this.mixer.clipAction(aclip);
    this._activeAction.play();
  }

  _uncacheActiveAction() {
    if (!this._activeAction) return;
    this.mixer.stopAllAction();
    this.mixer.uncacheAction(this._activeAction?.getClip());
    this._activeAction = undefined;
  }

  removeClip(id: string): Clip<KeyframeTrack> | undefined {
    if (this.activeClip === id) {
      this._uncacheActiveAction();
    }

    return super.removeClip(id);
  }

  setActiveClip(uuid: string): Clip<KeyframeTrack> | undefined {
    const clip = super.setActiveClip(uuid);

    if (clip) {
      this._updateAction(clip);

      clip.on('trackAdded', ({ clip }) => this._updateAction(clip));
      clip.on('trackRemoved', ({ clip }) => this._updateAction(clip));
      clip.on('trackUpdated', ({ clip }) => this._updateAction(clip));
    }

    return clip;
  }

  getMixer(): AnimationMixerPlus {
    return this.mixer;
  }

  setTime(n: number) {
    this.mixer.setTime(n);
    super.setTime(n);
  }
}
