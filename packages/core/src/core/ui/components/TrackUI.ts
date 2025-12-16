import type { KeyframeTrack } from 'three';
import { DivElement } from './BaseUI';
import { TrackSideContainer } from './tracks/TrackSideContainer';
import { TrackTimeContainer } from './tracks/TrackTimeContainer';
import { KeyframeUI } from './tracks/Keyframe';
import { PropertyUI } from './tracks/Property';

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
    this.refreshTracks();
  }

  override clear(): this {
    this.sideContainer.content.clear();
    this.timeContainer.tracksContainer.clear();
    this.tracks = [];
    return this;
  }

  refreshTracks() {
    this.tracks.forEach((track) => {
      track.frame.updatePosition(track.frame.value, this.duration);
    });
  }

  fromTrack(track: KeyframeTrack) {
    const kProperty = new PropertyUI(track.name);
    this.sideContainer.content.add(kProperty);

    const kcontainer = new DivElement().addClass('keyframe-container');
    const inner = new DivElement().addClass('track-inner-wrapper');

    track.times.forEach((t) => {
      const kFrames = new KeyframeUI(t, this.duration);
      this.tracks.push({ name: kProperty, frame: kFrames });
      inner.add(kFrames);
    });

    kcontainer.add(inner);

    this.timeContainer.tracksContainer.add(kcontainer);
  }
}
