import { EventBus } from '../EventBus';

export interface IAnimationEvents<IRoot, ITrack> {
  // Playback events
  play: null;
  pause: null;
  stop: null;

  // Time events
  timeUpdate: { time: number };

  // Duration events
  durationChange: { duration: number };

  // Track events
  trackAdd: { track: ITrack };
  trackRemove: { track: ITrack };
  trackUpdate: { track: ITrack };

  // Root events
  rootChange: { root: IRoot };
}

export type IAnimationEngine<IRoot, ITrack> = {
  root: IRoot;
  tracks: ITrack[];
  setRoot(r: IRoot): void;

  getTracks(): ITrack[];
  fromArray(array: ITrack[]): void;

  addTrack(track: ITrack): void;
  removeTrack(track: ITrack): void;
  clearTracks(): void;

  setTime(n: number): void;
  setDuration(n: number): void;
  getDuration(n: number): void;
};

export class AnimationEngine<IRoot, ITrack>
  extends EventBus<IAnimationEvents<IRoot, ITrack>>
  implements IAnimationEngine<IRoot, ITrack>
{
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
