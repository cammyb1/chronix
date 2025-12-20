import Clip from './Clip';
import { EventBus } from './EventBus';
import type { IAnimationEvents, TrackLike } from './types';

export class AnimationEngine<IRoot = any, ITrack extends TrackLike = TrackLike> extends EventBus<
  IAnimationEvents<IRoot, ITrack>
> {
  root: IRoot;
  clips: Clip<ITrack>[];
  protected activeClip?: string;

  constructor(r?: IRoot) {
    super();
    this.root = r || ({} as IRoot);
    this.clips = [];
  }

  active(): Clip<ITrack> | undefined {
    return this.activeClip ? this.findClipById(this.activeClip) : undefined;
  }

  setActiveClip(uuid: string): Clip<ITrack> | undefined {
    const clip = this.findClipById(uuid);
    if (!clip) {
      console.error(`Missing clip with id: ${uuid}`);
      return undefined;
    }

    const oldClip = this.active();
    this.activeClip = uuid;
    this.trigger('switchActive', { clip, oldClip });

    return clip;
  }

  createClip(name: string, array?: ITrack[]): Clip<ITrack> {
    const duration =
      array?.reduce((acc, current) => {
        acc = Math.max(acc, current.times[current.times.length - 1]);
        return acc;
      }, 0) || 1;

    const clip = new Clip<ITrack>({ name, duration }).fromArray(array || []);
    this.clips.push(clip);
    this.trigger('clipAdded', { clip });
    return clip;
  }

  updateClip(clip: Clip<ITrack>): Clip<ITrack> | undefined {
    const index = this.clips.findIndex((c) => c.uuid() === clip.uuid());
    const existingClip = this.clips[index];
    if (existingClip) {
      const updatedClip = { ...existingClip, ...clip } as Clip<ITrack>;
      this.clips.splice(index, 1, updatedClip);
      this.trigger('clipUpdated', { clip: updatedClip });
      return updatedClip;
    }
    return undefined;
  }

  removeClip(id: string): Clip<ITrack> | undefined {
    const index = this.clips.findIndex((c) => c.uuid() === id);
    if (index >= 0) {
      const clip: Clip<ITrack> = this.clips.splice(index, 1)[0];
      this.trigger('clipRemoved', { clip });
    }
    return undefined;
  }

  filterClips(
    predicate: (clip: Clip<ITrack>, index: number, array: Clip<ITrack>[]) => boolean,
  ): Clip<ITrack>[] {
    return this.clips.filter(predicate);
  }

  filterClipsByProperty<K extends string>(property: K, value: any) {
    return this.filterClips((c: Clip<ITrack>) => property in c && (c as any)[property] === value);
  }

  findClipById(id: string): Clip<ITrack> | undefined {
    return this.findClip((c) => c.uuid() === id);
  }

  findClip(
    predicate: (clip: Clip<ITrack>, index: number, array: Clip<ITrack>[]) => boolean,
  ): Clip<ITrack> | undefined {
    return this.clips.find(predicate);
  }

  findClipByName(name: string): Clip<ITrack> | undefined {
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
