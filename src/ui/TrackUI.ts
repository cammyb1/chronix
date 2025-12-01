import UIElement from './UIElement';

export class PropertyUI extends UIElement {
  constructor(name: string) {
    super(document.createElement('div'));

    this.setTextContent(name);
    this.addClass('property-name');
  }
}

export class KeyframeContainerUI extends UIElement {
  constructor() {
    super(document.createElement('div'));
    this.addClass('keyframe-container');
  }
}

export class KeyframeUI extends UIElement {
  value: number;
  constructor(value: number, duration: number) {
    super(document.createElement('div'));

    this.value = value;
    this.addClass('keyframe');
    this.updatePosition(value, duration);
  }

  updatePosition(value: number, duration: number, scale: number = 1) {
    const pos =(value / duration) * scale * 100;

    this.dom.style.left = `calc(${pos}% - 3px)`;
  }
}

export default class TrackUI extends UIElement {
  keyContainer: KeyframeContainerUI;
  keyframes: KeyframeUI[];
  duration: number;
  scale: number;
  times: ArrayLike<number>;
  values: ArrayLike<number>;

  constructor(name: string, times: ArrayLike<number>, values: ArrayLike<number>) {
    super(document.createElement('div'));

    this.addClass('track-item');

    this.keyContainer = new KeyframeContainerUI();
    this.keyframes = [];
    this.duration = 0;
    this.times = times;
    this.values = values;
    this.scale = 1;

    this.add(new PropertyUI(name));
    this.add(this.keyContainer);

    this.generateFrames(times);
  }

  updateKeyframes() {
    console.log(this.scale)
    this.keyframes.forEach((k) => {
      k.updatePosition(k.value, this.duration, this.scale);
    });
  }

  setDuration(t: number) {
    this.duration = t;
    this.updateKeyframes();
  }

  setScale(scale: number) {
    this.scale = scale;
    this.updateKeyframes();
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
