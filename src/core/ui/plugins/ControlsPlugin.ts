import type { AnimationPlayer } from '../../AnimationPlayer';
import type TimeUIPlugin from '@core/types';
import { TrackControlsUI } from '../components/tracks/TrackControls';

export default class ControlsPlugin implements TimeUIPlugin {
  name = 'ControlPlugin';
  container: TrackControlsUI;
  parent: AnimationPlayer | undefined;

  constructor() {
    this.container = new TrackControlsUI();
  }

  onAdd() {
    this.container.on('play', () => this.parent?.play());
    this.container.on('pause', () => this.parent?.pause());
    this.container.on('stop', () => this.parent?.stop());
    this.container.on('updateDuration', ({ value }) => this.parent?.setDuration(value));
  }

  onAttach(parent: AnimationPlayer): void {
    this.parent = parent;

    this.container.setDurationValue(this.parent.getDuration());

    this.parent.on('durationChange', ({ duration }) => {
      this.container.setDurationValue(duration);
    });
  }

  onDetach(): void {
    this.parent = undefined;
  }

  render(): TrackControlsUI {
    return this.container;
  }
}
