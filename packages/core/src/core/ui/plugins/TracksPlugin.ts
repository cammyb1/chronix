import type { AnimationPlayer } from '../../AnimationPlayer';
import type TimeUIPlugin from '../../types';
import TracksUI from '../components/TrackUI';

export default class TracksPlugin implements TimeUIPlugin {
  name = 'TracksPlugin';
  container: TracksUI;
  constructor() {
    this.container = new TracksUI();
  }

  onMount() {
    const timeContainerBounds = this.container.timeContainer.dom.getBoundingClientRect();
    this.container.timeContainer.updateRulerHeight(timeContainerBounds.height);
  }

  updateTracks(parent: AnimationPlayer) {
    this.container.clear();
    this.container.setDuration(parent.getDuration());

    parent.getTracks().forEach((track) => {
      this.container.fromTrack(track);
    });
  }

  onAttach(parent: AnimationPlayer): void {
    this.container.setDuration(parent.getDuration());
    this.container.timeContainer.rulerTick.setTime(parent.getTime());

    this.container.on('timeupdate', ({ time }) => {
      parent.seek(time);
    });

    parent.on('timeUpdate', ({ time }) => {
      this.container.timeContainer.rulerTick.setTime(time);
    });

    parent.on('durationChange', () => {
      this.container.setDuration(parent.getDuration());
      this.updateTracks(parent);
    });
    parent.on('trackAdd', () => this.updateTracks(parent));
    parent.on('trackRemove', () => this.updateTracks(parent));
    parent.on('trackUpdate', () => this.updateTracks(parent));
  }

  render(): TracksUI {
    return this.container;
  }
}
