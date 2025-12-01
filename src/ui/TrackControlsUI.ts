import TimeUIElement from './TimeUIElement';

export default class TrackControlsUI extends TimeUIElement {
  constructor() {
    super(document.createElement('div'));
    this.addClass('track-controls');
  }
}
