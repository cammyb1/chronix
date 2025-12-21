import { DivElement, UIElement } from './components/BaseUI';
import AnimationPlayer from '../AnimationPlayer';
import type UIPlugin from './plugins/UIPlugin';

export default class TimeLineUI extends DivElement {
  parent: AnimationPlayer;
  plugins: Map<string, UIPlugin> = new Map();
  _observer: MutationObserver | undefined;

  constructor(parent: AnimationPlayer) {
    super();

    this.addClass('timeline-container');
    this.parent = parent;

    this._observer = new MutationObserver((mutations) => {
      this.plugins.forEach((plugin: UIPlugin) => {
        const target: UIElement | undefined = plugin.render?.();
        if (!target) return;

        const targetAdded = mutations.some((mutation) => {
          return Array.from(mutation.addedNodes).includes(target.dom);
        });

        const targetRemoved = mutations.some((mutation) => {
          return Array.from(mutation.removedNodes).includes(target.dom);
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
  }

  registerPlugins(...args: Array<new (p: AnimationPlayer) => UIPlugin>): this {
    args.forEach((plugin) => this.addPlugin(plugin));
    return this;
  }

  addPlugin(Plugin: new (p: AnimationPlayer) => UIPlugin): this {
    const name = Plugin.name;
    if (this.plugins.has(name)) return this;

    const instance = new Plugin(this.parent);
    instance.init?.();
    this.plugins.set(name, instance);

    const target = instance.render?.();

    if (target) {
      this.add(target);
    }

    return this;
  }

  removePlugin(name: string): this {
    const plugin = this.plugins.get(name);
    if (!plugin) return this;

    plugin.dispose?.();

    const target = plugin.render?.();

    if (target) {
      this.remove(target);
    }
    this.plugins.delete(name);
    return this;
  }
}
