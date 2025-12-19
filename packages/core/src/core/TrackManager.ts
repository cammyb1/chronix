import { EventBus } from './EventBus';
import type { ITrackEvents, TrackLike } from './types';

export default class TrackManager<
  TTrack extends TrackLike = TrackLike,
> extends EventBus<ITrackEvents> {
  private tracks: TTrack[];

  constructor(tracks?: TTrack[]) {
    super();
    this.tracks = tracks || [];
  }

  addTrack(track: TTrack): TTrack {
    this.tracks.push(track);
    this.trigger('trackAdded', { track });
    return track;
  }

  updateTrack(index: number, track: TTrack): TTrack | undefined {
    if (index >= 0 && index < this.tracks.length) {
      this.tracks[index] = track;
      this.trigger('trackUpdated', { track });
      return track;
    }
    return undefined;
  }

  removeTrack(track: TTrack): TTrack | undefined {
    const index = this.tracks.indexOf(track);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      this.trigger('trackRemoved', { track });
      return track;
    }
    return undefined;
  }

  getTracksByName(name: string): TTrack[] {
    return this.tracks.filter((track) => (track as any).name === name);
  }

  getTracksByProperty<K extends string>(key: K, value: any): TTrack[] {
    return this.tracks.filter((track) => (track as any)[key] === value);
  }

  filterTracks(predicate: (track: TTrack) => boolean): TTrack[] {
    return this.tracks.filter(predicate);
  }

  fromArray(tracks: TTrack[]): this {
    this.tracks = tracks;
    return this;
  }

  hasTrack(track: TTrack): boolean {
    return this.tracks.includes(track);
  }

  getTracks(): TTrack[] {
    return this.tracks;
  }

  clearTracks(): void {
    this.tracks.forEach((t) => this.removeTrack(t));
  }
}
