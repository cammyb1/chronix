import PlayerRuler from './PlayerRuler';
import UIElement from './UIElement';

export default class TrackContainerUI extends UIElement<{ timeupdate: { time: number } }> {
  ruler: PlayerRuler;

  constructor() {
    super(document.createElement('div'));

    this.addClass('track-container');
    this.ruler = new PlayerRuler();
    this.add(this.ruler);

    this.ruler.on('timeupdate', (e) => {
      this.trigger('timeupdate', e);
    });
  }
}
