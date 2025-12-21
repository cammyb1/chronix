import { TrackControlsUI } from '../components/TrackControls';
import UIPlugin from './UIPlugin';

export default class ControlsPlugin extends UIPlugin<TrackControlsUI> {
  container: TrackControlsUI = new TrackControlsUI();

  init() {
    this.container.on('play', () => this.parent.play());
    this.container.on('pause', () => this.parent.pause());
    this.container.on('stop', () => this.parent.stop());
    this.container.on('updateDuration', ({ value }) => this.parent.setDuration(value));

    this.container.setDurationValue(this.parent.getDuration());

    this.parent.on('clipAdded', ({ clip }) => {
      this.container.names.addOption(clip.name, clip.uuid, false);
    });

    this.parent.on('durationChange', ({ duration }) => {
      this.container.setDurationValue(duration);
    });

    this.container.on('updateName', ({ value }) => {
      this.parent.engine()?.setActiveClip(value);
    });
  }

  render(): TrackControlsUI {
    return this.container;
  }
}
