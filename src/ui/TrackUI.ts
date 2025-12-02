import type { KeyframeTrack } from 'three';
import PlayerRuler, { RulerTime, type RulerEvent } from './PlayerRuler';
import { UIElement } from './BaseUI';
import { ButtonElement, DivElement, InputElement } from './BaseUI';

export class TrackControlsUI extends DivElement {
  nameInput: InputElement;
  durationInput: InputElement;
  onPlay: () => void = () => {};
  onPause: () => void = () => {};
  onStop: () => void = () => {};

  constructor() {
    super();
    this.addClass('track-controls');

    this.nameInput = new InputElement('text').addClass('track-input');
    this.durationInput = new InputElement('number').addClass('track-input');

    this.nameInput.dom.value = 'Test';

    this.durationInput.dom.min = '0';
    this.durationInput.dom.value = '0.0';
    this.durationInput.dom.step = '0.1';

    const play = new ButtonElement().addClass(['track-button', 'icon-play']);
    const pause = new ButtonElement().addClass(['track-button', 'icon-pause']);
    const stop = new ButtonElement().addClass(['track-button', 'icon-stop']);

    play.on('click', () => this.onPlay());
    pause.on('click', () => this.onPause());
    stop.on('click', () => this.onStop());

    this.add(play);
    this.add(pause);
    this.add(stop);
    this.add(this.nameInput);
    this.add(this.durationInput);
  }
}

export class TrackSubheaderUI extends DivElement<RulerEvent> {
  ruler: PlayerRuler;
  constructor() {
    super();

    this.addClass('track-sub-header');

    const side = new DivElement().addClass('track-side-container').add(new AddTrackButton());
    const timeline = new DivElement().addClass('track-time-container');
    this.ruler = new PlayerRuler();
    timeline.add(new RulerTime());
    timeline.add(this.ruler);

    this.ruler.on('timeupdate', (e) => this.trigger('timeupdate', e));

    this.add(side);
    this.add(timeline);
  }

  setTime(t: number) {
    this.ruler.setTime(t);
  }

  setDuration(d: number) {
    this.ruler.setDuration(d);
  }
}

export class AddTrackButton extends DivElement {
  constructor() {
    super();
    const button = new ButtonElement().addClass(['track-button', 'icon-plus']);
    const label = new UIElement(document.createElement('span'));

    button.dom.style.background = 'transparent';
    button.dom.style.border = 'none';

    label.dom.style.fontFamily = 'calibri';
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
    this.addClass('keyframe');
    this.updatePosition(value, duration);
  }

  updatePosition(value: number, duration: number, scale: number = 1) {
    if (duration <= 0) return;
    const pos = (value / duration) * scale * 100;

    this.dom.style.left = `calc(${pos}% - 3px)`;
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

    this.add(this.propertyContainer);
    this.add(this.timeContainer);

    this.duration = 0;
    this.tracks = [];

    this.addClass('track-body');
  }

  setDuration(v: number) {
    this.duration = v;
    this.refreshTracks();
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

    track.times.forEach((t) => {
      const kFrames = new KeyframeUI(t, this.duration);
      this.tracks.push({ name: kProperty, frame: kFrames });
      kcontainer.add(kFrames);
    });

    this.timeContainer.add(kcontainer);
  }
}
