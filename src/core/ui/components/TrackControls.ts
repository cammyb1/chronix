import type { ChangeEvent, ITrackControlEvents } from '@core/types';
import { ButtonElement, DivElement, InputElement, SelectElement } from './BaseUI';

export class TrackControlsUI extends DivElement<ITrackControlEvents> {
  names: SelectElement;
  duration: InputElement;

  constructor() {
    super();
    this.addClass('track-controls');

    this.names = new SelectElement().addClass('track-input');
    this.duration = new InputElement('number').addClass('track-input');

    this.mountElements();
  }

  mountElements() {
    this.names.dom.value = 'Test';

    this.duration.dom.min = '0';
    this.duration.dom.value = '0.0';
    this.duration.dom.step = '0.1';

    const addClip = new ButtonElement().addClass('track-button', 'icon-plus');
    const removeClip = new ButtonElement().addClass('track-button', 'icon-minus');

    const buttonContainer = new DivElement().addClass('track-controls-buttons');
    const inputContainer = new DivElement().addClass('track-controls-inputs');

    const play = new ButtonElement().addClass('track-button', 'icon-play');
    const pause = new ButtonElement().addClass('track-button', 'icon-pause');
    const stop = new ButtonElement().addClass('track-button', 'icon-stop');
    const restart = new ButtonElement().addClass('track-button', 'icon-loop');

    addClip.on('click', () => this.trigger('addClip'));
    removeClip.on('click', () => this.trigger('removeClip'));
    play.on('click', () => this.trigger('play'));
    pause.on('click', () => this.trigger('pause'));
    stop.on('click', () => this.trigger('stop'));
    restart.on('click', () => this.trigger('restart'));

    buttonContainer.add(play, pause, stop, restart);
    inputContainer.add(this.names, this.duration);
    this.add(addClip, removeClip, inputContainer, buttonContainer);

    this.names.on('change', (e: ChangeEvent<HTMLOptionElement>) => {
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
}
