import {
  type AnimationAction,
  type AnimationClip,
  type AnimationObjectGroup,
  type AnimationBlendMode,
  type Object3D,
  type KeyframeTrack,
  AnimationMixer,
} from 'three';
import { FunctionKeyframeTrack } from './FunctionKeyframeTrack';
import { TrackEventManager } from './TrackEventManager';

export class AnimationMixerPlus extends AnimationMixer {
  protected eventManager: TrackEventManager;

  constructor(root: Object3D | AnimationObjectGroup) {
    super(root);
    this.eventManager = new TrackEventManager();
  }

  override update(dt: number): this {
    this.eventManager.update(dt);
    super.update(dt);
    return this;
  }

  override clipAction(
    clip: AnimationClip,
    optionalRoot?: Object3D,
    blendMode?: AnimationBlendMode,
  ): AnimationAction {
    const isFnTrack = <T extends KeyframeTrack>(t: T) => t instanceof FunctionKeyframeTrack;
    const cloned = clip.clone();

    cloned.tracks = cloned.tracks.filter((t) => !isFnTrack(t));
    const fnTracks = clip.tracks.filter(isFnTrack);
    const action = super.clipAction(cloned, optionalRoot, blendMode);

    if (fnTracks.length > 0) {
      this.eventManager.registerTracks(fnTracks, action);
    }
    return action;
  }
}
