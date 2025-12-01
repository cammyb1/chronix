import UIElement from './UIElement';

export default class TrackControlsUI extends UIElement {
  constructor() {
    super(document.createElement('div'));
    this.addClass('track-controls');
  }
}
