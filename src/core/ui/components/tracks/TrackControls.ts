import type { ChangeEvent, ITrackControlEvents } from '@core/types';
import { ButtonElement, DivElement, InputElement } from '../BaseUI';

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
