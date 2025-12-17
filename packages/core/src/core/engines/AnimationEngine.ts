import { EventBus } from '../EventBus';
import type { IAnimationEvents, ITrackManager } from '../types';

export class AnimationEngine<IRoot = any, ITrack extends object = any>
  extends EventBus<IAnimationEvents<IRoot, ITrack>>
  implements ITrackManager
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

  getTracksByName(name: string): ITrack[] {
    return this.getTracksByProperty('name', name);
  }

  getTracksByProperty<K extends string>(key: K, value: any): ITrack[] {
    return this.filterTracks((track: ITrack) => {
      return key in track && (track as any)[key] === value;
    });
  }

  filterTracks(preditacte: (track: ITrack) => boolean): ITrack[] {
    return this.tracks.filter(preditacte);
  }

  hasTrack(track: ITrack): boolean {
    return this.findTrackIndex(track) >= 0;
  }

  private findTrackIndex(track: ITrack): number {
    return this.tracks.findIndex((t) => t === track);
  }

  updateTrack(index: number, track: ITrack): void {
    if (!this.tracks[index]) return;
    this.tracks.splice(index, 1, track);
    this.trigger('trackUpdated', { track });
  }

  addTrack(track: ITrack): void {
    if (this.hasTrack(track)) return;
    this.tracks.push(track);
    this.trigger('trackAdd', { track });
  }

  removeTrack(track: ITrack): void {
    const existingIndex = this.findTrackIndex(track);
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
