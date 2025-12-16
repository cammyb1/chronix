import { DivElement } from "../BaseUI";
import PlayerRuler, { RulerTime } from "../PlayerRuler";

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
