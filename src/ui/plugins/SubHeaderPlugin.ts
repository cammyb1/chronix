import type { AnimationPlayer } from '../../core/AnimationPlayer';
import type { UIElement } from '../components/BaseUI';
import type TimeUIPlugin from '../TimeUIPlugin';
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

    parent.on('durationChange', ({ duration }) => {
      this.container.rulerTime.setDuration(duration);
      this.container.ruler.setDuration(duration);
    });
    parent.on('timeUpdate', ({ time }) => {
      this.container.ruler.setTime(time);
    });

    this.container.ruler.on('timeupdate', ({ time }) => {
      parent.setTime(time);
    });
  }

  render(): UIElement {
    return this.container;
  }
}
