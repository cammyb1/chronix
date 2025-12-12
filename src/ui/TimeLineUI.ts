import { DivElement } from './components/BaseUI';
import { AnimationPlayer } from '../core/AnimationPlayer';
import type TimeUIPlugin from './TimeUIPlugin';

export interface TimeLineParams {
  parent?: AnimationPlayer;
  plugins?: TimeUIPlugin[];
}

export default class TimeLineUI extends DivElement {
  parent: AnimationPlayer | undefined;
  plugins: Map<string, TimeUIPlugin> = new Map();

  constructor({ parent, plugins }: TimeLineParams = {}) {
    super();

    this.addClass('timeline-container');
    this.setParent(parent);

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

  addPlugin(plugin: TimeUIPlugin) {
    if (this.plugins.has(plugin.name)) return;
    this.plugins.set(plugin.name, plugin);
    plugin.init?.();

    if (this.parent) {
      plugin.onAttach?.(this.parent);
    }

    this.add(plugin.render());
  }

  removePlugin(name: string) {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    plugin.exit?.();
    this.remove(plugin.render());
    this.plugins.delete(name);
  }
}
