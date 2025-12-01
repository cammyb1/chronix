import type { KeyframeTrack } from 'three';
import PlayerRuler from './PlayerRuler';
import { UIElement } from './BaseUI';
import { ButtonElement, DivElement, InputElement } from './BaseUI';

export class TrackControlsUI extends DivElement {
  nameInput: InputElement;
  durationInput: InputElement;

  constructor() {
    super();
    this.addClass('track-controls');

    this.nameInput = new InputElement('text').addClass('track-input');
    this.durationInput = new InputElement('number').addClass('track-input');

    this.nameInput.dom.value = 'Test';

    this.durationInput.dom.min = '0';
    this.durationInput.dom.value = '0.0';
    this.durationInput.dom.step = '0.1';

    this.add(new ButtonElement().addClass(['track-button', 'icon-play']));
    this.add(new ButtonElement().addClass(['track-button', 'icon-pause']));
    this.add(new ButtonElement().addClass(['track-button', 'icon-stop']));
    this.add(this.nameInput);
    this.add(this.durationInput);
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

    this.addClass('track-property-container');
    this.add(new AddTrackButton());
  }
}

export class TrackTimeContainer extends DivElement {
  ruler: PlayerRuler;
  constructor() {
    super();

    this.ruler = new PlayerRuler();
    this.add(this.ruler);
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

export class RulerTime extends DivElement {
  constructor() {
    super();

    this.addClass('track-ruler');
  }
}

export class TracksUI extends DivElement<{ timeupdate: { time: number } }> {
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

    this.timeContainer.add(new RulerTime());

    this.addClass('track-body');

    this.timeContainer.ruler.on('timeupdate', (event) => {
      this.trigger('timeupdate', event);
    });
  }

  setDuration(v: number) {
    this.duration = v;

    this.refreshTracks();
    this.timeContainer.ruler.setDuration(v);
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
