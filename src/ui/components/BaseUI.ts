import { EventBus } from '../../core/EventBus';

export class UIElement<
  TEvents extends {} = {},
  TDom extends HTMLElement = HTMLElement,
> extends EventBus<TEvents> {
  dom: TDom;
  constructor(dom: TDom) {
    super();
    this.dom = dom;
  }

  add(element: UIElement<any, HTMLElement>): this {
    this.dom.appendChild(element.dom);
    return this;
  }

  remove(element: UIElement<any>): this {
    this.dom.removeChild(element.dom);

    return this;
  }

  clear(): this {
    this.setHTML('');

    return this;
  }

  addAttribute(name: string, value: string) {
    this.dom.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.dom.removeAttribute(name);
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

export class DivElement<E extends Record<string, any> = {}> extends UIElement<E, HTMLDivElement> {
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

export type ChangeEvent<T extends EventTarget = HTMLElement> = {
  target: T;
};

export class InputElement extends UIElement<
  { change: ChangeEvent<HTMLInputElement> },
  HTMLInputElement
> {
  constructor(type: string) {
    super(document.createElement('input'));
    this.dom.type = type;

    this.dom.addEventListener('change', (e: Event) => {
      this.trigger('change', { target: e.target as HTMLInputElement });
    });
  }
}
