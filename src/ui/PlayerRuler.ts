import { DivElement } from './BaseUI';

export default class PlayerRuler extends DivElement<{ timeupdate: { time: number } }> {
  dragging: boolean = false;
  duration: number = 1;

  constructor() {
    super();

    this.addClass('player-ruler');

    this.dom.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setTime(time: number) {
    if (this.duration <= 0) return;
    const percentage = (time / this.duration) * 100;
    this.dom.style.left = `${percentage}%`;
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.dragging = true;
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
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

    this.trigger('timeupdate', { time });
    this.setTime(time);
  };

  onMouseUp = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };
}

export class RulerTime extends DivElement {
  constructor() {
    super();

    this.addClass('track-ruler');
  }
}
