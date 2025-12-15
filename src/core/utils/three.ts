import { PerspectiveCamera, WebGLRenderer, Scene } from 'three';
import { EventBus } from '../EventBus';
import { Time } from '../Time';
import type { IThreeExampleEvents } from '../types';

export function mount(domElement: HTMLElement) {
  let size = { x: domElement.clientWidth, y: domElement.clientHeight };
  const scene: Scene = new Scene();
  const camera: PerspectiveCamera = new PerspectiveCamera(35, size.x / size.y, 0.1, 2000);
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });

  return {
    _started: false,
    _observer: null as ResizeObserver | null,
    scene,
    camera,
    renderer,
    events: new EventBus<IThreeExampleEvents>(),
    _tick() {
      if (!this._started) return;

      renderer.render(scene, camera);
    },
    _resize() {
      camera.aspect = domElement.clientWidth / domElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(domElement.clientWidth, domElement.clientHeight);
      renderer.render(scene, camera);

      this.events.trigger('resize');
    },
    init(): typeof this {
      if (this._started) return this;
      this._started = true;
      Time.start();

      domElement.appendChild(renderer.domElement);

      renderer.setSize(size.x, size.y);
      Time.on('loop', this._tick.bind(this));

      this._observer = new ResizeObserver(this._resize.bind(this));
      this._observer.observe(domElement);

      return this;
    },
    dispose(): typeof this {
      if (!this._started) return this;
      this._started = false;

      renderer.domElement.parentNode?.removeChild(renderer.domElement);
      Time.off('loop', this._tick.bind(this));
      domElement.removeEventListener('resize', this._resize.bind(this));

      this._observer?.unobserve(domElement);
      this._observer?.disconnect();

      Time.stop();

      return this;
    },
  };
}
