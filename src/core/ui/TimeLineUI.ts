import { DivElement } from './components/BaseUI';
import AnimationPlayer from '../AnimationPlayer';
import type TimeUIPlugin from '../types';

export interface TimeLineParams {
  parent?: AnimationPlayer;
  plugins?: TimeUIPlugin[];
}

export default class TimeLineUI extends DivElement {
  parent: AnimationPlayer | undefined;
  plugins: Map<string, TimeUIPlugin> = new Map();
  _observer: MutationObserver | undefined;

  constructor({ parent, plugins }: TimeLineParams = {}) {
    super();

    this.addClass('timeline-container');
    this.setParent(parent);

    this._observer = new MutationObserver((mutations) => {
      this.plugins.forEach((plugin) => {
        const targetAdded = mutations.some((mutation) => {
          return Array.from(mutation.addedNodes).includes(plugin.render().dom);
        });

        const targetRemoved = mutations.some((mutation) => {
          return Array.from(mutation.removedNodes).includes(plugin.render().dom);
        });

        if (targetAdded) {
          plugin.onMount?.();
        }

        if (targetRemoved) {
          plugin.onDismount?.();
        }
      });
    });

    this._observer.observe(this.dom, { childList: true });

    if (plugins) {
      plugins.forEach((plugin) => this.addPlugin(plugin));
    }
  }

  setParent(p: AnimationPlayer | undefined): this {
    if (!p) return this;
    this.plugins.forEach((plugin) => {
      if (this.parent) {
        plugin.onDetach?.(this.parent);
      }

      plugin.onAttach?.(p);
    });
    this.parent = p;
    return this;
  }

  addPlugin(plugin: TimeUIPlugin): this {
    if (this.plugins.has(plugin.name)) return this;
    this.plugins.set(plugin.name, plugin);

    const target = plugin.render();

    this.add(target);

    plugin.onAdd?.();

    if (this.parent) {
      plugin.onAttach?.(this.parent);
    }
    return this;
  }

  removePlugin(name: string): this {
    const plugin = this.plugins.get(name);
    if (!plugin) return this;

    plugin.exit?.();
    this.remove(plugin.render());
    this.plugins.delete(name);
    return this;
  }
}
