import type { KeyframeTrack } from 'three';
import PlayerRuler, { RulerTime } from './PlayerRuler';
import { UIElement, type ChangeEvent } from './BaseUI';
import { ButtonElement, DivElement, InputElement } from './BaseUI';
import type { IRulerEvent, ITrackControlEvents } from '../../core/types';

export class TrackControlsUI extends DivElement<ITrackControlEvents> {
  name: InputElement;
  duration: InputElement;

  constructor() {
    super();
    this.addClass('track-controls');

    this.name = new InputElement('text').addClass('track-input');
    this.duration = new InputElement('number').addClass('track-input');

    this.name.dom.value = 'Test';

    this.duration.dom.min = '0';
    this.duration.dom.value = '0.0';
    this.duration.dom.step = '0.1';

    const play = new ButtonElement().addClass(['track-button', 'icon-play']);
    const pause = new ButtonElement().addClass(['track-button', 'icon-pause']);
    const stop = new ButtonElement().addClass(['track-button', 'icon-stop']);

    play.on('click', () => this.trigger('play'));
    pause.on('click', () => this.trigger('pause'));
    stop.on('click', () => this.trigger('stop'));

    this.add(play);
    this.add(pause);
    this.add(stop);
    this.add(this.name);
    this.add(this.duration);

    this.name.on('change', (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target?.value) {
        this.trigger('updateName', { value: e.target.value });
      }
    });

    this.duration.on('change', (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target?.value) {
        this.trigger('updateDuration', { value: parseFloat(e.target.value) });
      }
    });
  }

  setDurationValue(value: number) {
    this.duration.dom.value = value.toString();
  }

  setNameValue(value: string) {
    this.name.dom.value = value;
  }
}

export class TrackSubheaderUI extends DivElement<IRulerEvent> {
  ruler: PlayerRuler;
  rulerTime: RulerTime;
  constructor() {
    super();

    this.addClass('track-sub-header');

    const side = new DivElement().addClass('track-side-container');
    const timeline = new DivElement().addClass('track-time-container');
    this.ruler = new PlayerRuler();
    this.rulerTime = new RulerTime();
    const wrapper = new DivElement().addClass('track-inner-wrapper');
    wrapper.add(this.rulerTime);
    wrapper.add(this.ruler);

    timeline.add(wrapper);

    this.ruler.on('timeupdate', (e) => this.trigger('timeupdate', e));

    this.add(side);
    this.add(timeline);
  }

  setTime(t: number) {
    this.ruler.setTime(t);
  }

  setDuration(d: number) {
    this.ruler.setDuration(d);
    (this.rulerTime as RulerTime).setDuration(d);
  }
}

export class AddTrackButton extends DivElement {
  constructor() {
    super();
    const button = new ButtonElement().addClass(['track-button', 'icon-plus']);
    const label = new UIElement(document.createElement('span'));

    label.setHTML('Add keyframe');

    this.add(button);
    this.add(label);
    this.addClass('track-addTrack');
  }
}

export class TrackPropertyContainer extends DivElement {
  constructor() {
    super();

    this.addClass('track-side-container');
  }
}

export class TrackTimeContainer extends DivElement {
  constructor() {
    super();
    this.addClass('track-time-container');
  }
}

export class PropertyUI extends DivElement {
  constructor(name: string) {
    super();

    this.setTextContent(name);
    this.addClass('property-name');
  }
}

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
    const margin = -5;

    this.dom.style.left = `calc(${pos}% + ${margin}px)`;
  }
}

export class TracksUI extends DivElement {
  propertyContainer: TrackPropertyContainer;
  timeContainer: TrackTimeContainer;

  tracks: Array<{ name: PropertyUI; frame: KeyframeUI }>;
  duration: number;

  constructor() {
    super();

    this.propertyContainer = new TrackPropertyContainer();
    this.timeContainer = new TrackTimeContainer();

    const scrollContent = new DivElement().addClass('track-scroll-content');
    scrollContent.add(this.propertyContainer);
    scrollContent.add(this.timeContainer);

    this.add(scrollContent);

    this.duration = 0;
    this.tracks = [];

    this.addClass('track-body');
  }

  setDuration(v: number) {
    this.duration = v;
    this.refreshTracks();
  }

  override clear(): this {
    this.propertyContainer.clear();
    this.timeContainer.clear();
    this.tracks = [];
    return this;
  }

  refreshTracks() {
    this.tracks.forEach((track) => {
      track.frame.updatePosition(track.frame.value, this.duration);
    });
  }

  fromTrack(track: KeyframeTrack) {
    const kProperty = new PropertyUI(track.name);
    this.propertyContainer.add(kProperty);

    const kcontainer = new DivElement().addClass('keyframe-container');
    const wrapper = new DivElement().addClass('track-inner-wrapper');

    track.times.forEach((t) => {
      const kFrames = new KeyframeUI(t, this.duration);
      this.tracks.push({ name: kProperty, frame: kFrames });
      wrapper.add(kFrames);
    });

    kcontainer.add(wrapper);
    this.timeContainer.add(kcontainer);
  }
}
