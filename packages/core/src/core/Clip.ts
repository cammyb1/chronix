import { EventBus } from './EventBus';
import type { ClipConfig, ITrackEvents, TrackLike } from './types';

export default class Clip<ITrack extends TrackLike = TrackLike> extends EventBus<
  ITrackEvents<ITrack>
> {
  protected id: string;
  name: string;
  duration: number;
  loop: boolean;
  private tracks: ITrack[];

  constructor(config: ClipConfig<ITrack>) {
    super();
    this.id = window.crypto.randomUUID();
    this.name = config.name;
    this.duration = config.duration || 1;
    this.loop = config.loop || false;
    this.tracks = config.tracks || [];
  }

  get uuid(): string {
    return this.id;
  }

  setDuration(dur: number) {
    this.duration = dur;
  }

  getDuration(): number {
    return this.duration;
  }

  addTrack(track: ITrack): ITrack {
    this.tracks.push(track);
    this.trigger('trackAdded', { track, clip: this });
    return track;
  }

  updateTrack(index: number, track: ITrack): ITrack | undefined {
    if (index >= 0 && index < this.tracks.length) {
      this.tracks[index] = track;
      this.trigger('trackUpdated', { track, clip: this });
      return track;
    }
    return undefined;
  }

  removeTrack(track: ITrack): ITrack | undefined {
    const index = this.tracks.indexOf(track);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      this.trigger('trackRemoved', { track, clip: this });
      return track;
    }
    return undefined;
  }

  getTracksByName(name: string): ITrack[] {
    return this.tracks.filter((track) => (track as any).name === name);
  }

  getTracksByProperty<K extends string>(key: K, value: any): ITrack[] {
    return this.tracks.filter((track) => (track as any)[key] === value);
  }

  filterTracks(predicate: (track: ITrack) => boolean): ITrack[] {
    return this.tracks.filter(predicate);
  }

  fromArray(tracks: ITrack[]): this {
    this.tracks = tracks;
    return this;
  }

  hasTrack(track: ITrack): boolean {
    return this.tracks.includes(track);
  }

  getTracks(): ITrack[] {
    return this.tracks;
  }

  clearTracks(): void {
    this.tracks.forEach((t) => this.removeTrack(t));
  }
}
