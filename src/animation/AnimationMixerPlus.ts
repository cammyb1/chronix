import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  AnimationObjectGroup,
  KeyframeTrack,
  type AnimationBlendMode,
  type Object3D,
} from 'three';
import { FunctionKeyframeTrack } from './FunctionKeyframeTrack';
import { EventManager } from './EventManager';

export class AnimationMixerPlus extends AnimationMixer {
  protected eventManager: EventManager;

  constructor(root: Object3D | AnimationObjectGroup) {
    super(root);
    this.eventManager = new EventManager();
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
    const isTrack = <T extends KeyframeTrack>(t: T) => t instanceof FunctionKeyframeTrack;
    const cloned = clip.clone();

    cloned.tracks = cloned.tracks.filter((t) => !isTrack(t));
    const fnTracks = clip.tracks.filter(isTrack);
    const action = super.clipAction(cloned, optionalRoot, blendMode);

    if (fnTracks.length > 0) {
      this.eventManager.registerTracks(fnTracks, action);
    }
    return action;
  }
}
