import { DivElement } from './BaseUI';
import { TrackSideContainer } from './tracks/TrackSideContainer';
import { TrackTimeContainer } from './tracks/TrackTimeContainer';
import { KeyframeUI } from './tracks/KeyframeUI';
import { PropertyUI } from './tracks/Property';
import KeyframeContainer from './tracks/KeyframeContainer';
import type { TrackLike } from '@/core/types';

export default class TracksUI extends DivElement<{ timeupdate: { time: number } }> {
  sideContainer: TrackSideContainer;
  timeContainer: TrackTimeContainer;

  tracks: Array<{ name: PropertyUI; frame: KeyframeUI }>;
  duration: number;

  constructor() {
    super();

    this.sideContainer = new TrackSideContainer();
    this.timeContainer = new TrackTimeContainer();

    this.duration = 0;
    this.tracks = [];

    this.addClass('track-body');

    const onScroll = (e: { target: HTMLElement }) => {
      const target = e.target as HTMLElement;
      if (target === this.timeContainer.tracksContainer.dom) {
        this.sideContainer.content.dom.scrollTop = target.scrollTop;
      } else if (target === this.sideContainer.content.dom) {
        this.timeContainer.tracksContainer.dom.scrollTop = target.scrollTop;
      }
    };

    this.timeContainer.on('timeupdate', ({ time }) => {
      this.trigger('timeupdate', { time });
    });
    this.timeContainer.on('scroll', onScroll);
    this.sideContainer.on('scroll', onScroll);

    // Scrollable content
    this.add(this.sideContainer);
    this.add(this.timeContainer);
  }

  setDuration(v: number) {
    this.duration = v;
    this.timeContainer.setDuration(v);
    this.tracks.forEach((track) => {
      track.frame.setDuration(v);
    });
  }

  override clear(): this {
    this.sideContainer.content.clear();
    this.timeContainer.tracksContainer.clear();
    this.tracks = [];
    return this;
  }

  fromTrack(tPos: number, track: TrackLike) {
    const kProperty = new PropertyUI(track.name);
    this.sideContainer.content.add(kProperty);

    const container = new KeyframeContainer();

    track.times.forEach((t, kPos) => {
      const kFrames = new KeyframeUI(t, this.duration);
      this.tracks.push({ name: kProperty, frame: kFrames });
      kFrames.on('dragEnd', (ev: any) => this.trigger('trackUpdated', { tPos: tPos, kPos, ...ev }));
      container.add(kFrames);
    });

    this.timeContainer.tracksContainer.add(container);
  }
}
