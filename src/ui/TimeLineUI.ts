import { DivElement } from './components/BaseUI';
import { AnimationTimeLine } from '../core/AnimationTimeLine';
import type TimeUIPlugin from './TimeUIPlugin';

export interface TimeLineEvents {
  timeupdate: { time: number };
  durationChange: { duration: number };
}

export interface TimeLineParams {
  parent?: AnimationTimeLine;
  plugins?: TimeUIPlugin[];
}

export default class TimeLineUI extends DivElement<TimeLineEvents> {
  parent: AnimationTimeLine | undefined;
  plugins: Map<string, TimeUIPlugin> = new Map();

  constructor({ parent, plugins }: TimeLineParams = {}) {
    super();

    this.addClass('timeline-container');
    this.parent = parent;

    if (plugins) {
      plugins.forEach((plugin) => this.addPlugin(plugin));
    }
  }

  setParent(p: AnimationTimeLine | undefined): this {
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

  setDuration(n: number) {
    this.trigger('durationChange', { duration: n });
  }
}
