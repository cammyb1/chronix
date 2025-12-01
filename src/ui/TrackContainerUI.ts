import PlayerRuler from './PlayerRuler';
import TimeUIElement from './TimeUIElement';

export default class TrackContainerUI extends TimeUIElement<{ timeupdate: { time: number } }> {
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
