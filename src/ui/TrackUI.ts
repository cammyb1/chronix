import TimeUIElement from './TimeUIElement';

export class PropertyUI extends TimeUIElement {
  constructor(name: string) {
    super(document.createElement('div'));

    this.setTextContent(name);
    this.addClass('property-name');
  }
}

export class KeyframeContainerUI extends TimeUIElement {
  constructor() {
    super(document.createElement('div'));
    this.addClass('keyframe-container');
  }
}

export class KeyframeUI extends TimeUIElement {
  value: number;
  constructor(value: number, duration: number) {
    super(document.createElement('div'));

    this.value = value;
    this.addClass('keyframe');
    this.updatePosition(value, duration);
  }

  updatePosition(value: number, duration: number) {
    const pos = (value / duration) * 100;

    this.dom.style.left = `calc(${pos}% - 3px)`;
  }
}

export default class TrackUI extends TimeUIElement {
  keyContainer: KeyframeContainerUI;
  keyframes: KeyframeUI[];
  duration: number;
  times: ArrayLike<number>;
  values: ArrayLike<number>;

  constructor(name: string, times: ArrayLike<number>, values: ArrayLike<number>, duration: number) {
    super(document.createElement('div'));

    this.addClass('track-item');

    this.keyContainer = new KeyframeContainerUI();
    this.keyframes = [];
    this.duration = duration;
    this.times = times;
    this.values = values;

    this.add(new PropertyUI(name));
    this.add(this.keyContainer);

    this.generateFrames(times);
  }

  updateDuration(t: number) {
    this.duration = t;

    this.keyframes.forEach((k) => {
      k.updatePosition(k.value, this.duration);
    });
  }

  generateFrames(times: ArrayLike<number>) {
    (times as number[]).forEach((t) => {
      const k = new KeyframeUI(t, this.duration);
      this.keyframes.push(k);
      this.keyContainer.add(k);
    });
  }

  clearFrames() {
    this.keyframes.forEach((k) => {
      this.keyContainer.remove(k);
    });
    this.keyframes = [];
  }
}
