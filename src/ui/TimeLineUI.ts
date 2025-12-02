import type { KeyframeTrack } from 'three';
import { DivElement, InputElement, type ChangeEvent } from './BaseUI';
import { TrackControlsUI, TrackSubheaderUI, TracksUI } from './TrackUI';

export interface TimeLineEvents {
  timeupdate: { time: number };
  durationChange: { duration: number };
  play: null;
  pause: null;
  stop: null;
}

export default class TimeLineUI extends DivElement<TimeLineEvents> {
  tracksContainer: TracksUI;
  tracksControls: TrackControlsUI;
  trackSubHeader: TrackSubheaderUI;
  duration: number;
  scale: number;

  constructor() {
    super();

    this.addClass('timeline-container');

    this.duration = 0;
    this.scale = 1;
    this.tracksContainer = new TracksUI();
    this.trackSubHeader = new TrackSubheaderUI();
    this.tracksControls = new TrackControlsUI();

    this.tracksControls.durationInput.on('change', (e: ChangeEvent<InputElement>) => {
      const duration = e.target?.dom.value;
      if (duration) {
        const parsedDuration = parseFloat(duration);
        this.setDuration(parsedDuration);
        this.trigger('durationChange', { duration: parsedDuration });
      }
    });

    this.tracksControls.onPlay = () => this.trigger('play');
    this.tracksControls.onPause = () => this.trigger('pause');
    this.tracksControls.onStop = () => this.trigger('stop');

    this.trackSubHeader.on('timeupdate', (e) => this.trigger('timeupdate', e));

    this.add(this.tracksControls);
    this.add(this.trackSubHeader);
    this.add(this.tracksContainer);

    this.setScale(this.scale);
    this.setDuration(this.duration);
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  setDuration(n: number) {
    this.duration = n;
    this.tracksContainer.setDuration(n);
    this.trackSubHeader.setDuration(n);
    this.tracksControls.durationInput.dom.value = n.toString();
  }

  setTime(t: number) {
    this.trackSubHeader.setTime(t);
  }

  registerTracks(tracks: KeyframeTrack[]): this {
    tracks.forEach((track) => {
      this.tracksContainer.fromTrack(track);
    });
    return this;
  }

  removeTracks(): this {
    return this;
  }
}
