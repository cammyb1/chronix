import type { AnimationEngine } from './engines/AnimationEngine';
import { ThreeAnimationEngine } from './engines/ThreeAnimationEngine';
import { VanillaAnimationEngine } from './engines/VanillaAnimationEngine';

export default class EngineBuilder {
  static engineList: { [key: string]: new (...args: any[]) => AnimationEngine<any, any> } = {
    three: ThreeAnimationEngine,
    vanilla: VanillaAnimationEngine,
  };

  static register(
    type: string,
    engineClass: new (...args: any[]) => AnimationEngine<any, any>,
  ): void {
    if (this.engineList[type]) return;
    this.engineList[type] = engineClass;
  }

  static create(type: string, ...args: any[]): AnimationEngine<any, any> {
    const engineClass = this.engineList[type];
    if (!engineClass) {
      throw new Error(`Engine type "${type}" is not registered.`);
    }
    return new engineClass(...args);
  }
}
