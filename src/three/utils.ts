import { PerspectiveCamera, WebGLRenderer, Scene } from 'three';
import { EventBus } from '@core/EventBus';
import { Time } from '@core/Time';
import {
  type AnimationAction,
  BooleanKeyframeTrack,
  KeyframeTrack,
  ColorKeyframeTrack,
  NumberKeyframeTrack,
  QuaternionKeyframeTrack,
  StringKeyframeTrack,
  VectorKeyframeTrack,
} from 'three';
import { FunctionKeyframeTrack } from './FunctionKeyframeTrack';
import type { IThreeExampleEvents, IAnimationEvent } from '@core/types';

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

export enum Keyframes {
  BOOLEAN = 0,
  COLOR = 1,
  NUMBER = 2,
  QUAT = 3,
  STRING = 4,
  VECTOR = 5,
  FUNC = 6,
}

export function getTrackByType(name: Keyframes) {
  switch (name) {
    case Keyframes.BOOLEAN:
      return BooleanKeyframeTrack;
    case Keyframes.COLOR:
      return ColorKeyframeTrack;
    case Keyframes.NUMBER:
      return NumberKeyframeTrack;
    case Keyframes.STRING:
      return StringKeyframeTrack;
    case Keyframes.FUNC:
      return FunctionKeyframeTrack;
    case Keyframes.QUAT:
      return QuaternionKeyframeTrack;
    case Keyframes.VECTOR:
      return VectorKeyframeTrack;
    default:
      return KeyframeTrack;
  }
}

export function generateEventTracks(tracks: FunctionKeyframeTrack[], action: AnimationAction) {
  const events: IAnimationEvent[] = [];

  if (!action.getRoot()) return [];

  tracks.forEach((track) => {
    const times = track.times;
    const values = track.values;

    for (let i = 0; i < times.length; i++) {
      const raw = values[i].toString().trim();
      const currentTime = times[i];

      if (raw === '') continue;

      const event: IAnimationEvent = {
        action,
        name: '',
        args: [],
        frame: {
          time: currentTime,
          lastTime: action.time,
        },
      };

      if (raw.includes(':')) {
        const [name, args] = raw.split(':');
        event.name = name;
        event.args = args.split(',').map((arg) => arg.trim());
        events.push(event);
      } else {
        const name = raw;
        event.name = name;
        events.push(event);
      }
    }
  });

  return events;
}
