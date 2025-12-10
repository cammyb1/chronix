import type { UIElement } from './components/BaseUI';
import type { AnimationTimeLine } from '../core/AnimationTimeLine';

export default interface TimeUIPlugin {
  name: string;
  init?(): void;
  onAttach?(parent: AnimationTimeLine): void;
  onDetach?(parent: AnimationTimeLine): void;
  exit?(): void;
  render(): UIElement;
}
