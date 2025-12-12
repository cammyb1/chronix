import type { UIElement } from './components/BaseUI';
import type { AnimationPlayer } from '../core/AnimationPlayer';

export default interface TimeUIPlugin {
  name: string;
  init?(): void;
  onAttach?(parent: AnimationPlayer): void;
  onDetach?(parent: AnimationPlayer): void;
  exit?(): void;
  render(): UIElement;
}
