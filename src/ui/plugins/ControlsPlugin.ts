import type { AnimationTimeLine } from '../../core/AnimationTimeLine';
import type { UIElement } from '../components/BaseUI';
import type TimeUIPlugin from '../TimeUIPlugin';
import { TrackControlsUI } from '../components/TrackUI';

export default class ControlsPlugin implements TimeUIPlugin {
  name = 'ControlPlugin';
  container: TrackControlsUI;
  parent: AnimationTimeLine | undefined;

  constructor() {
    this.container = new TrackControlsUI();
  }

  init() {
    this.container.on('play', () => {
      if (this.parent) {
        this.parent.play();
      }
    });
    this.container.on('pause', () => {
      if (this.parent) {
        this.parent.pause();
      }
    });
    this.container.on('stop', () => {
      if (this.parent) {
        this.parent.stop();
      }
    });

    this.container.on('updateDuration', ({ value }) => {
      if (this.parent) {
        this.parent.setDuration(value);
      }
    });
  }

  onAttach(parent: AnimationTimeLine): void {
    this.parent = parent;

    this.container.setDurationValue(this.parent.getDuration());

    this.parent.on('updateProps', () => {
      if (!this.parent) return;
      this.container.setDurationValue(this.parent.getDuration());
    });
  }
  onDetach(): void {
    this.parent = undefined;
  }

  render(): UIElement {
    return this.container;
  }
}
