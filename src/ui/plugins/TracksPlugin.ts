import type { AnimationPlayer } from '../../core/AnimationPlayer';
import type ITimeUIPlugin from '../../core/types';
import { TracksUI } from '../components/TrackUI';

export default class TracksPlugin implements ITimeUIPlugin {
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

    parent.on('durationChange', () => this.registerTracks(parent));

    parent.on('trackAdd', () => {
      this.registerTracks(parent);
    });
  }

  render(): TracksUI {
    return this.container;
  }
}
