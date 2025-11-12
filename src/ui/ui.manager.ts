import type { KeyframeTrack } from 'three';

export class TimeUIElement {
  dom: HTMLElement;
  constructor(dom: HTMLElement) {
    this.dom = dom;
  }

  add(element: TimeUIElement): this {
    this.dom.appendChild(element.dom);
    return this;
  }

  remove(element: TimeUIElement): this {
    this.dom.removeChild(element.dom);

    return this;
  }

  clear(): this {
    this.dom.childNodes.forEach((child) => {
      this.dom.removeChild(child);
    });

    return this;
  }

  setId(id: string): this {
    this.dom.id = id;
    return this;
  }

  addClass(name: string): this {
    this.dom.classList.add(name);
    return this;
  }

  removeClass(name: string): this {
    this.dom.classList.remove(name);
    return this;
  }

  setTextContent(node: string) {
    this.dom.textContent = node;
  }

  setHTML(node: string) {
    this.dom.innerHTML = node;
  }
}

export class PropertyUI extends TimeUIElement {
  constructor(name: string) {
    super(document.createElement('span'));

    this.setTextContent(name);
    this.addClass('property-name');
  }
}

export class SubPropertyUI extends TimeUIElement {}

export class TrackUI extends TimeUIElement {
  constructor(name: string, times: ArrayLike<number>, values: ArrayLike<number>) {
    super(document.createElement('div'));

    this.add(new PropertyUI(name));
    this.addClass('track-container');
  }
}

export class TimeLineUI extends TimeUIElement {
  tracks: TrackUI[] = [];

  constructor() {
    super(document.createElement('div'));
    this.addClass('timeline-container');
  }

  registerTracks(tracks: KeyframeTrack[]) {
    tracks.forEach((track) => {
      let ui = new TrackUI(track.name, track.times, track.values);
      this.tracks.push(ui);
      this.add(ui);
    });
  }

  removeTracks() {
    this.tracks.forEach((track) => {
      this.remove(track);
    });
  }

  update() {}
}
