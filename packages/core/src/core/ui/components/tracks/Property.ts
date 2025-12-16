import { DivElement } from '../BaseUI';

export class PropertyUI extends DivElement {
  constructor(name: string) {
    super();

    this.setTextContent(name);
    this.addClass('property-name');
  }
}
