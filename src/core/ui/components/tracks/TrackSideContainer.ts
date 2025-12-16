import { DivElement } from '../BaseUI';

export class TrackSideContainer extends DivElement {
  content: DivElement;
  constructor() {
    super();

    this.addClass('track-side-container');
    this.content = new DivElement().addClass('track-side-content');
    this.add(new DivElement().addClass('property-header'));
    this.add(this.content);
  }
}
