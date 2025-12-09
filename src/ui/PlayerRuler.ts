import { DivElement } from './BaseUI';

export interface RulerEvent {
  timeupdate: { time: number };
}

export default class PlayerRuler extends DivElement<RulerEvent> {
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

  setDuration(duration: number) {
    this.dom.innerHTML = '';
    
    // Determine step size based on duration
    // If duration is small (< 10s), show every 0.1s
    // If duration is medium (< 60s), show every 0.5s or 1s
    
    let step = 0.1;
    if (duration > 10) step = 0.5;
    if (duration > 30) step = 1;
    if (duration > 100) step = 5;

    // Use a small epsilon for float comparison
    const eps = 0.001;

    for (let i = 0; i <= duration + eps; i += step) {
      const tick = document.createElement('div');
      tick.classList.add('ruler-tick');
      
      const left = (i / duration) * 100;
      tick.style.left = `${left}%`;
      
      // Check if integer (Major tick)
      const isMajor = Math.abs(i - Math.round(i)) < eps;

      if (isMajor) {
         tick.classList.add('major');
         const label = document.createElement('span');
         label.className = 'ruler-label';
         label.innerText = Math.round(i).toString();
         tick.appendChild(label);
      } else {
         tick.classList.add('minor');
      }
      
      this.dom.appendChild(tick);
    }
  }
}
