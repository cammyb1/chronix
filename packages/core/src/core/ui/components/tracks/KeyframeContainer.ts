import { DivElement } from '../BaseUI';
import type { KeyframeUI } from './KeyframeUI';

export default class KeyframeContainer extends DivElement {
  inner: DivElement;

  constructor() {
    super();
    this.addClass('keyframe-container');
    this.inner = new DivElement().addClass('track-inner-wrapper');
    super.add(this.inner);
  }

  override clear(): this {
    this.inner.clear();
    return this;
  }

  override add(element: KeyframeUI): this {
    this.inner.add(element);
    return this;
  }

  override remove(element: KeyframeUI): this {
    this.inner.remove(element);
    return this;
  }
}
