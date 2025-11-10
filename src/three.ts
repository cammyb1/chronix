import { PerspectiveCamera, WebGLRenderer, Scene, Clock } from 'three';
import { EventBus } from './core/EventBus';

export interface TEvents {
  resize: {};
  tick: { dt: number; elapsed: number };
}

export function mount(domElement: HTMLElement) {
  let size = { x: domElement.clientWidth, y: domElement.clientHeight };
  const scene: Scene = new Scene();
  const camera: PerspectiveCamera = new PerspectiveCamera(35, size.x / size.y, 0.1, 2000);
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });

  const clock = new Clock(false);

  return {
    _started: false,
    _observer: null as ResizeObserver | null,
    scene,
    camera,
    renderer,
    events: new EventBus<TEvents>(),
    _tick() {
      if (!this._started) return;

      renderer.render(scene, camera);

      this.events.trigger({
        type: 'tick',
        dt: clock.getDelta(),
        elapsed: clock.getElapsedTime(),
      });
    },
    _resize() {
      camera.aspect = domElement.clientWidth / domElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(domElement.clientWidth, domElement.clientHeight);
      renderer.render(scene, camera);

      this.events.trigger({ type: 'resize' });
    },
    init(): typeof this {
      if (this._started) return this;
      this._started = true;
      clock.start();

      domElement.appendChild(renderer.domElement);

      renderer.setSize(size.x, size.y);
      renderer.setAnimationLoop(this._tick.bind(this));

      this._observer = new ResizeObserver(this._resize.bind(this));
      this._observer.observe(domElement);

      return this;
    },
    dispose(): typeof this {
      if (!this._started) return this;
      this._started = false;
      clock.stop();

      renderer.domElement.parentNode?.removeChild(renderer.domElement);
      renderer.setAnimationLoop(null);
      domElement.removeEventListener('resize', this._resize.bind(this));

      this._observer?.unobserve(domElement);
      this._observer?.disconnect();

      return this;
    },
  };
}
