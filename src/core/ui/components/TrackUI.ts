import type { KeyframeTrack } from 'three';
import PlayerRuler, { RulerTime } from './PlayerRuler';
import { type ChangeEvent } from './BaseUI';
import { ButtonElement, DivElement, InputElement } from './BaseUI';
import type { ITrackControlEvents } from '../../types';

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

export class TrackSideContainer extends DivElement {
  content: DivElement;
  constructor() {
    super();

    this.addClass('track-side-container');
    this.content = new DivElement().addClass('track-side-content');
    this.add(new DivElement().addClass('property-header'));
    this.add(this.content);
  }
}

export class TrackTimeContainer extends DivElement<{
  scroll: { target: HTMLElement };
  timeupdate: { time: number };
}> {
  tracksContainer: DivElement;
  rulerTick: PlayerRuler;
  rulerTime: RulerTime;

  constructor() {
    super();
    this.addClass('track-time-container');

    this.tracksContainer = new DivElement().addClass('tracks-container');

    // Ruler over Time container
    const rulerContainer = new DivElement().addClass('ruler-container');
    const rullerInner = new DivElement().addClass('ruler-inner-wrapper');
    this.rulerTick = new PlayerRuler();
    this.rulerTime = new RulerTime();
    rullerInner.add(this.rulerTime);
    rullerInner.add(this.rulerTick);
    rulerContainer.add(rullerInner);

    this.tracksContainer.dom.addEventListener('scroll', (e: Event) => {
      if (e.target) {
        this.trigger('scroll', { target: e.target as HTMLElement });
      }
    });

    this.rulerTick.on('timeupdate', ({ time }) => {
      this.trigger('timeupdate', { time });
    });

    this.rulerTime.on('timeupdate', ({ time }) => {
      this.rulerTick.setTime(time);
      this.trigger('timeupdate', { time });
    });

    this.add(rulerContainer);
    this.add(this.tracksContainer);
  }

  updateRulerHeight(height: number) {
    this.rulerTick.dom.style.height = `${height}px`;
  }

  setDuration(v: number) {
    this.rulerTick.setDuration(v);
    this.rulerTime.setDuration(v);
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
    let margin = -5; // Half of keyframe width to center it

    this.dom.style.left = `calc(${pos}% + ${margin}px)`;
  }
}

export class TracksUI extends DivElement<{ timeupdate: { time: number } }> {
  sideContainer: TrackSideContainer;
  timeContainer: TrackTimeContainer;

  tracks: Array<{ name: PropertyUI; frame: KeyframeUI }>;
  duration: number;

  constructor() {
    super();

    this.sideContainer = new TrackSideContainer();
    this.timeContainer = new TrackTimeContainer();

    this.duration = 0;
    this.tracks = [];

    this.addClass('track-body');

    const onScroll = (e: { target: HTMLElement } | Event) => {
      const target = e.target as HTMLElement;
      if (target === this.timeContainer.tracksContainer.dom) {
        this.sideContainer.content.dom.scrollTop = target.scrollTop;
      } else if (target === this.sideContainer.content.dom) {
        this.timeContainer.tracksContainer.dom.scrollTop = target.scrollTop;
      }
    };

    this.timeContainer.on('timeupdate', ({ time }) => {
      this.trigger('timeupdate', { time });
    });
    this.timeContainer.on('scroll', onScroll);
    this.sideContainer.content.dom.addEventListener('scroll', onScroll);

    // Scrollable content
    this.add(this.sideContainer);
    this.add(this.timeContainer);
  }

  setDuration(v: number) {
    this.duration = v;
    this.timeContainer.setDuration(v);
    this.refreshTracks();
  }

  override clear(): this {
    this.sideContainer.content.clear();
    this.timeContainer.tracksContainer.clear();
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
    this.sideContainer.content.add(kProperty);

    const kcontainer = new DivElement().addClass('keyframe-container');
    const inner = new DivElement().addClass('track-inner-wrapper');

    track.times.forEach((t) => {
      const kFrames = new KeyframeUI(t, this.duration);
      this.tracks.push({ name: kProperty, frame: kFrames });
      inner.add(kFrames);
    });

    kcontainer.add(inner);

    this.timeContainer.tracksContainer.add(kcontainer);
  }
}
