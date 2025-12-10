import type { AnimationTimeLine } from '../../core/AnimationTimeLine';
import type { UIElement } from '../components/BaseUI';
import type TimeUIPlugin from '../TimeUIPlugin';
import { TracksUI } from '../components/TrackUI';

export default class TracksPlugin implements TimeUIPlugin {
  name = 'TracksPlugin';
  container: TracksUI;
  constructor() {
    this.container = new TracksUI();
  }

  registerTracks(parent: AnimationTimeLine) {
    this.container.clear();
    this.container.setDuration(parent.getDuration());

    parent.getTracks().forEach((track) => {
      this.container.fromTrack(track);
    });
  }

  onAttach(parent: AnimationTimeLine): void {
    this.registerTracks(parent);

    parent.on('updateProps', () => {
      this.registerTracks(parent);
    });
  }

  render(): UIElement {
    return this.container;
  }
}
