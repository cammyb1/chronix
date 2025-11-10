import { AnimationClip, StringKeyframeTrack, type AnimationClipJSON } from 'three';

const oldParse = AnimationClip.parse;

type FunctionKeyframeTrackJSON = {
  name: string;
  times: number[];
  values: string[] | number[];
  type: string;
};

AnimationClip.parse = function (json: AnimationClipJSON): AnimationClip {
  const cloned: AnimationClipJSON = structuredClone(json);
  const fnTracks: FunctionKeyframeTrackJSON[] = json.tracks.filter((t) => t.type === 'function');

  cloned.tracks = json.tracks.filter((t) => t.type !== 'function');
  const clip = oldParse.bind(this)(cloned);

  fnTracks.forEach((track) => {
    clip.tracks.push(new FunctionKeyframeTrack(track.name, track.times, track.values as string[]));
  });

  clip.resetDuration();

  return clip;
};

export class FunctionKeyframeTrack extends StringKeyframeTrack {
  constructor(name: string, times: ArrayLike<number>, values: ArrayLike<string>) {
    super(name, times, values);
  }
}

FunctionKeyframeTrack.prototype.ValueTypeName = 'function';
