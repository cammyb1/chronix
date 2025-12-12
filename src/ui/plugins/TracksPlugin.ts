import type { AnimationPlayer } from '../../core/AnimationPlayer';
import type { UIElement } from '../components/BaseUI';
import type TimeUIPlugin from '../TimeUIPlugin';
import { TracksUI } from '../components/TrackUI';

export default class TracksPlugin implements TimeUIPlugin {
  name = 'TracksPlugin';
  container: TracksUI;
  constructor() {
    this.container = new TracksUI();
  }

  registerTracks(parent: AnimationPlayer) {
    this.container.clear();
    this.container.setDuration(parent.getDuration());

    parent.getTracks().forEach((track) => {
      this.container.fromTrack(track);
    });
  }

  onAttach(parent: AnimationPlayer): void {
    this.registerTracks(parent);

    parent.on('trackAdd', () => {
      this.registerTracks(parent);
    });
  }

  render(): UIElement {
    return this.container;
  }
}
