import type { KeyframeTrack } from 'three';
import { InputElement, UIElement, type ChangeEvent } from './BaseUI';
import { TrackControlsUI, TracksUI } from './TrackUI';

export default class TimeLineUI extends UIElement<{ timeupdate: { time: number } }> {
  tracksContainer: TracksUI;
  duration: number;
  scale: number;

  constructor() {
    super(document.createElement('div'));

    this.addClass('timeline-container');

    this.duration = 0;
    this.scale = 1;
    this.tracksContainer = new TracksUI();

    const tracksControls = new TrackControlsUI();

    tracksControls.durationInput.on('change', (e: ChangeEvent<InputElement>) => {
      const duration = e.target?.dom.value;
      if (duration) {
        this.setDuration(parseFloat(duration));
      }
    });

    this.tracksContainer.on('timeupdate', (e) => this.trigger('timeupdate', e));

    this.add(tracksControls);
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

  update() {}
}
