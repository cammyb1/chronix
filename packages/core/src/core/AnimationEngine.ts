import { EventBus } from './EventBus';
import TrackManager from './TrackManager';
import type { IAnimationEvents, IClip, TrackLike } from './types';

export class AnimationEngine<IRoot = any, ITrack extends TrackLike = TrackLike> extends EventBus<
  IAnimationEvents<IRoot, ITrack>
> {
  root: IRoot;
  protected clips: IClip<ITrack>[];

  constructor(r?: IRoot) {
    super();
    this.root = r || ({} as IRoot);
    this.clips = [];
  }

  createClip(name: string, array?: ITrack[]): IClip<ITrack> {
    const duration =
      array?.reduce((acc, current) => {
        acc = Math.max(acc, current.times[current.times.length - 1]);
        return acc;
      }, 0) || 1;

    const id = window.crypto.randomUUID();
    const clip: IClip<ITrack> = { id, name, duration, tracks: new TrackManager(array) };
    this.clips.push(clip);
    this.trigger('clipAdded', { clip });
    return clip;
  }

  updateClip(id: string, clip: Partial<IClip>): IClip<ITrack> | undefined {
    const index = this.clips.findIndex((c) => c.id === id);
    const existingClip = this.clips[index];
    if (existingClip) {
      const updatedClip = { ...existingClip, ...clip } as IClip<ITrack>;
      this.clips.splice(index, 1, updatedClip);
      this.trigger('clipUpdated', { clip: updatedClip });
      return updatedClip;
    }
    return undefined;
  }

  removeClip(id: string): IClip<ITrack> | undefined {
    const index = this.clips.findIndex((c) => c.id === id);
    if (index >= 0) {
      const clip: IClip<ITrack> = this.clips.splice(index, 1)[0];
      this.trigger('clipRemoved', { clip });
    }
    return undefined;
  }

  filterClips(
    predicate: (clip: IClip<ITrack>, index: number, array: IClip<ITrack>[]) => boolean,
  ): IClip<ITrack>[] {
    return this.clips.filter(predicate);
  }

  filterClipsByProperty<K extends string>(property: K, value: any) {
    return this.filterClips((c: IClip<ITrack>) => property in c && (c as any)[property] === value);
  }

  findClipById(id: string): IClip<ITrack> | undefined {
    return this.filterClipsByProperty('id', id)[0];
  }

  findClip(
    predicate: (clip: IClip<ITrack>, index: number, array: IClip<ITrack>[]) => boolean,
  ): IClip<ITrack> | undefined {
    return this.clips.find(predicate);
  }

  findClipByName(name: string): IClip<ITrack> | undefined {
    return this.filterClipsByProperty('name', name)[0];
  }

  setRoot(r: IRoot): void {
    this.root = r;
    this.trigger('rootChange', { root: r });
  }

  setTime(n: number): void {
    this.trigger('timeUpdate', { time: n });
  }
}
