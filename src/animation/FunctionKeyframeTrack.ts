import { StringKeyframeTrack } from 'three';

export class FunctionKeyframeTrack extends StringKeyframeTrack {
  constructor(times: ArrayLike<number>, values: ArrayLike<string>) {
    super('.', times, values);
  }
}
