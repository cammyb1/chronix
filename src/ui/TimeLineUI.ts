import type { KeyframeTrack } from 'three';
import UIElement from './UIElement';
import TrackUI from './TrackUI';
import TrackControlsUI from './TrackControlsUI';
import TrackContainerUI from './TrackContainerUI';

export default class TimeLineUI extends UIElement<{ timeupdate: { time: number } }> {
  tracks: TrackUI[] = [];
  duration: number;
  scale: number;
  container: TrackContainerUI;

  constructor() {
    super(document.createElement('div'));

    this.addClass('timeline-container');

    this.container = new TrackContainerUI();

    this.duration = 0;
    this.scale = 1;

    this.add(new TrackControlsUI());
    this.add(this.container);

    this.container.on('timeupdate', (e) => {
      this.trigger('timeupdate', e);
    });

    this.setScale(this.scale);
    this.setDuration(this.duration);
  }

  setScale(scale: number) {
    this.scale = scale;
    this.tracks.forEach((t) => {
      t.setScale(this.scale);
    });
  }

  setDuration(n: number) {
    this.duration = n;

    this.container.ruler.setDuration(n);
    this.tracks.forEach((t) => {
      t.setDuration(this.duration);
    });
  }

  registerTracks(tracks: KeyframeTrack[]): this {
    tracks.forEach((track) => {
      let ui = new TrackUI(track.name, track.times, track.values);
      ui.setDuration(this.duration);
      ui.setScale(this.scale);
      this.tracks.push(ui);
      this.container.add(ui);
    });

    return this;
  }

  removeTracks(): this {
    this.tracks.forEach((track) => {
      this.container.remove(track);
    });

    return this;
  }

  update() {}
}
