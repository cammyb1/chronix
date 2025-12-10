import type { AnimationTimeLine } from '../../core/AnimationTimeLine';
import type { UIElement } from '../components/BaseUI';
import type TimeUIPlugin from '../TimeUIPlugin';
import { TrackSubheaderUI } from '../components/TrackUI';

export default class SubHeaderPlugin implements TimeUIPlugin {
  name = 'SubheaderPlugin';
  container: TrackSubheaderUI;
  constructor() {
    this.container = new TrackSubheaderUI();
  }

  onAttach(parent: AnimationTimeLine) {
    parent.on('updateProps', () => {
      this.container.rulerTime.setDuration(parent.getDuration());
      this.container.ruler.setDuration(parent.getDuration());
    });
    parent.on('timeupdate', () => {
      this.container.ruler.setTime(parent.getActionTime());
    });

    this.container.ruler.on('timeupdate', ({ time }) => {
      parent.setTime(time);
    });
  }

  render(): UIElement {
    return this.container;
  }
}
