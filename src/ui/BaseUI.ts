import { EventBus } from '../core/EventBus';

export class UIElement<
  Events extends {} = {},
  D extends HTMLElement = HTMLElement,
> extends EventBus<Events> {
  dom: D;
  constructor(dom: D) {
    super();
    this.dom = dom;
  }

  add(element: UIElement<Events>): this {
    this.dom.appendChild(element.dom);
    return this;
  }

  remove(element: UIElement<Events>): this {
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

  addClass(name: string | Array<string>): this {
    if (Array.isArray(name)) {
      name.forEach((n) => this.dom.classList.add(n));
    } else {
      this.dom.classList.add(name);
    }
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

export class DivElement<E extends {} = {}> extends UIElement<E, HTMLDivElement> {
  constructor() {
    super(document.createElement('div'));
  }
}

export class ButtonElement extends UIElement<{ click: null }, HTMLButtonElement> {
  constructor() {
    super(document.createElement('button'));

    this.dom.addEventListener('click', () => {
      this.trigger('click');
    });
  }
}

export interface ChangeEvent<E extends UIElement> {
  target: E | null;
}

export class InputElement extends UIElement<
  { change: ChangeEvent<InputElement> },
  HTMLInputElement
> {
  constructor(type: string) {
    super(document.createElement('input'));
    this.dom.type = type;

    this.dom.addEventListener('change', (e: Event) => {
      this.trigger('change', e as ChangeEvent<InputElement>);
    });
  }
}
