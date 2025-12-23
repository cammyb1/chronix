import Clip from './Clip';
import { EventBus } from './EventBus';
import type { IAnimationEvents, TrackLike } from './types';

export class AnimationEngine<IRoot = any, ITrack extends TrackLike = TrackLike> extends EventBus<
  IAnimationEvents<IRoot, ITrack>
> {
  root: IRoot;
  clips: Clip<ITrack>[];
  protected activeClip?: string;
  time: number = 0;

  constructor(r?: IRoot) {
    super();
    this.root = r || ({} as IRoot);
    this.clips = [];
  }

  get active(): Clip<ITrack> | undefined {
    return this.activeClip ? this.findClipById(this.activeClip) : undefined;
  }

  setActiveClip(uuid: string): Clip<ITrack> | undefined {
    const clip = this.findClipById(uuid);
    if (!clip) {
      console.error(`Missing clip with id: ${uuid}`);
      return undefined;
    }

    const oldClip = this.active;

    if (oldClip) {
      this.setTime(0);
    }

    this.activeClip = uuid;
    this.trigger('switchActive', { clip, oldClip });

    return clip;
  }

  createClip({
    name,
    duration,
    loop,
    tracks,
  }: {
    name: string;
    duration: number;
    loop?: boolean;
    tracks?: ITrack[];
  }): Clip<ITrack> {
    const clip = new Clip<ITrack>({ name, duration, loop, tracks });
    this.clips.push(clip);
    if (this.clips.length === 1) {
      this.setActiveClip(clip.uuid);
    }
    this.trigger('clipAdded', { clip });
    return clip;
  }

  updateClip(clip: Clip<ITrack>): Clip<ITrack> | undefined {
    const index = this.clips.findIndex((c) => c.uuid === clip.uuid);
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
    const index = this.clips.findIndex((c) => c.uuid === id);
    if (index >= 0) {
      const clip: Clip<ITrack> = this.clips.splice(index, 1)[0];

      if (this.clips.length >= 1) {
        const newActive = this.clips[0];
        this.setActiveClip(newActive.uuid);
      }

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
    return this.findClip((c) => c.uuid === id);
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
    this.time = n;
    this.trigger('timeUpdate', { time: n });
  }
}
