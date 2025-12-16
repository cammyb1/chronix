import { DivElement } from '../BaseUI';

export class KeyframeUI extends DivElement {
  value: number;
  constructor(value: number, duration: number) {
    super();

    this.value = value;
    const isHighValue = duration - value > 0.15;
    this.addClass('keyframe');
    this.addAttribute(`data-tooltip-${isHighValue ? 'left' : 'right'}`, `${value.toFixed(2)}`);
    this.updatePosition(value, duration);
  }

  updatePosition(value: number, duration: number, scale: number = 1) {
    if (duration <= 0) return;
    const pos = (value / duration) * scale * 100;
    let margin = -5; // Half of keyframe width to center it

    this.dom.style.left = `calc(${pos}% + ${margin}px)`;
  }
}
