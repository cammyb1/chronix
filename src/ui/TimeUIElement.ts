import { EventBus } from "../core/EventBus";

export default class TimeUIElement<ET extends {} = {}> extends EventBus<ET> {
  dom: HTMLElement;
  constructor(dom: HTMLElement) {
    super();
    this.dom = dom;
  }

  add(element: TimeUIElement<ET>): this {
    this.dom.appendChild(element.dom);
    return this;
  }

  remove(element: TimeUIElement<ET>): this {
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
