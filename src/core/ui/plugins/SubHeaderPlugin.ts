import type { AnimationPlayer } from '../../AnimationPlayer';
import type TimeUIPlugin from '../../types';
import { TrackSubheaderUI } from '../components/TrackUI';

export default class SubHeaderPlugin implements TimeUIPlugin {
  name = 'SubheaderPlugin';
  container: TrackSubheaderUI;
  constructor() {
    this.container = new TrackSubheaderUI();
  }

  onAttach(parent: AnimationPlayer) {
    this.container.rulerTime.setDuration(parent.getDuration());
    this.container.ruler.setDuration(parent.getDuration());
    this.container.ruler.setTime(parent.getTime());

    this.container.rulerTime.on('click', ({ event }) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const width = rect.width;

      let percentage = x / width;
      percentage = Math.max(0, Math.min(1, percentage));
      const time = percentage * parent.getDuration();

      parent.seek(time);
    });

    parent.on('durationChange', ({ duration }) => {
      this.container.rulerTime.setDuration(duration);
      this.container.ruler.setDuration(duration);
    });
    parent.on('timeUpdate', ({ time }) => {
      this.container.ruler.setTime(time);
    });

    this.container.ruler.on('timeupdate', ({ time }) => {
      parent.seek(time);
    });
  }

  render(): TrackSubheaderUI {
    return this.container;
  }
}
