import { EventBus } from '../EventBus';
import type { IAnimationEvents } from '../types';

export class AnimationEngine<IRoot, ITrack> extends EventBus<IAnimationEvents<IRoot, ITrack>> {
  root: IRoot;
  tracks: ITrack[];
  duration: number = 1;

  constructor(r?: IRoot) {
    super();
    this.root = r || ({} as IRoot);
    this.tracks = [];
  }

  setRoot(r: IRoot): void {
    this.root = r;
    this.trigger('rootChange', { root: r });
  }
  getTracks(): ITrack[] {
    return Array.from(this.tracks.values());
  }

  fromArray(array: ITrack[]): void {
    array.forEach((track) => {
      this.addTrack(track);
    });
  }

  clearTracks(): void {
    this.tracks.forEach((t) => this.removeTrack(t));
  }

  addTrack(track: ITrack): void {
    const existingIndex = this.tracks.indexOf(track);
    if (existingIndex >= 0) {
      this.tracks.splice(existingIndex, 1, track);
      this.trigger('trackUpdate', { track });
    } else {
      this.tracks.push(track);
      this.trigger('trackAdd', { track });
    }
  }

  removeTrack(track: ITrack): void {
    const existingIndex = this.tracks.indexOf(track);
    if (existingIndex < 0) return;
    this.tracks.splice(existingIndex, 1);
    this.trigger('trackRemove', { track });
  }

  setTime(n: number): void {
    this.trigger('timeUpdate', { time: n });
  }
  setDuration(n: number): void {
    this.duration = n;
    this.trigger('durationChange', { duration: n });
  }
  getDuration(): number {
    return this.duration;
  }
}
