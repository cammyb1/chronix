import TimeUIElement from './TimeUIElement';

export default class PlayerRuler extends TimeUIElement<{ timeupdate: { time: number } }> {
  dragging: boolean = false;
  duration: number = 0;

  constructor() {
    super(document.createElement('div'));

    this.addClass('player-ruler');

    this.dom.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setTime(time: number) {
    if (this.duration <= 0) return;
    const percentage = (time / this.duration) * 80 + 20;
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

    // Limit to keyframe container area (20% to 100%)
    percentage = Math.max(0.2, Math.min(1, percentage));

    // Calculate time based on the 80% available width
    const normalized = (percentage - 0.2) / 0.8;
    const time = normalized * this.duration;

    this.trigger('timeupdate', { time });
    this.setTime(time);
  };

  onMouseUp = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };
}
