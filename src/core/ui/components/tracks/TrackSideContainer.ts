import { DivElement } from '../BaseUI';

export class TrackSideContainer extends DivElement<{ scroll: { target: HTMLElement } }> {
  content: DivElement;
  header: DivElement;

  constructor() {
    super();

    this.addClass('track-side-container');
    this.content = new DivElement().addClass('track-side-content');
    this.header = new DivElement().addClass('property-header');

    this.content.dom.addEventListener('scroll', (e) => {
      this.trigger('scroll', { target: e.target as HTMLElement });
    });

    this.add(this.header);
    this.add(this.content);
  }
}
