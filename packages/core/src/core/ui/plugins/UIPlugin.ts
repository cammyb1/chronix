import type AnimationPlayer from '@/core/AnimationPlayer';
import type IPlugin from '@core/types';
import type { UIElement } from '../components/BaseUI';

export default class UIPlugin<T extends UIElement = UIElement> implements IPlugin<T> {
  parent: AnimationPlayer;

  constructor(p: AnimationPlayer) {
    this.parent = p;
  }

  init?(): void;
  onMount?(): void;
  onDismount?(): void;
  dispose?(): void;
  render?(): T | undefined;
}
