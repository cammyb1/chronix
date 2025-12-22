import { TrackControlsUI } from '../components/TrackControls';
import UIPlugin from './UIPlugin';

export default class ControlsPlugin extends UIPlugin<TrackControlsUI> {
  container: TrackControlsUI = new TrackControlsUI();

  init() {
    this.container.on('play', () => this.player.play());
    this.container.on('pause', () => this.player.pause());
    this.container.on('stop', () => this.player.stop());
    this.container.on('restart', () => this.player.restart());
    this.container.on('updateDuration', ({ value }) => this.player.setDuration(value));

    this.container.setDurationValue(this.player.getDuration());

    this.player.on('clipAdded', ({ clip }) => {
      this.container.names.addOption(clip.name, clip.uuid, false);
    });

    this.player.on('durationChange', ({ duration }) => {
      this.container.setDurationValue(duration);
    });

    this.container.on('updateName', ({ value }) => {
      this.player.engine()?.setActiveClip(value);
    });
  }

  render(): TrackControlsUI {
    return this.container;
  }
}
