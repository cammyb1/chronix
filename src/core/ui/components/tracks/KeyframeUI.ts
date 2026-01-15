import { DivElement } from '../BaseUI';

export class KeyframeUI extends DivElement {
  private dragging: boolean = false;

  value: number;
  duration: number;

  constructor(value: number, duration: number) {
    super();

    this.value = value;
    this.duration = duration;

    this.addClass('keyframe');
    this.updatePosition();

    this.dom.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  setDuration(dur: number) {
    this.duration = dur;
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.dragging = true;
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    this.trigger('dragStart');
  }

  onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;

    const parent = this.dom.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    let percentage = x / width;
    percentage = Math.max(0, Math.min(1, percentage));
    const time = percentage * this.duration;

    this.value = time;

    this.trigger('drag', { value: time });

    this.updatePosition();
  };

  onMouseUp = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.trigger('dragEnd', { value: this.value });
  };

  updatePosition() {
    if (this.duration <= 0) return;

    const isHighValue = this.duration - this.value > 0.15;
    this.addAttribute(`data-tooltip-${isHighValue ? 'left' : 'right'}`, `${this.value.toFixed(2)}`);
    const pos = (this.value * 100) / this.duration;
    let margin = -5; // Half of keyframe width to center it

    this.dom.style.left = `calc(${pos}% + ${margin}px)`;
  }
}
