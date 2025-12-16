import { DivElement } from '../BaseUI';

export class TrackSideContainer extends DivElement {
  content: DivElement;
  header: DivElement;

  constructor() {
    super();

    this.addClass('track-side-container');
    this.content = new DivElement().addClass('track-side-content');
    this.header = new DivElement().addClass('property-header');

    this.add(this.header);
    this.add(this.content);
  }
}
