import {
  BooleanKeyframeTrack,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
  NumberKeyframeTrack,
} from 'three';
import { mount } from './three';

import './css/styles.css';
import { AnimationTimeLine } from './timeline/AnimationTimeLine';
import { FunctionKeyframeTrack } from './core/FunctionKeyframeTrack';
import { Time } from './core/Time';

const app = document.getElementById('app') as HTMLElement;

class Box extends Mesh<BoxGeometry, MeshStandardMaterial> {
  constructor() {
    super(new BoxGeometry(2, 2, 2), new MeshStandardMaterial({ color: 'white' }));
  }

  cambiarColor(color: string) {
    this.material.color.set(color);
  }
}

if (app) {
  const webgl = mount(app);

  webgl.init();

  const box = new Box();
  const light = new DirectionalLight('#ffffff', 4);

  webgl.scene.add(box);
  webgl.scene.add(light);

  light.position.y = 3;
  light.position.z = 15;

  const timeline = new AnimationTimeLine(box);

  document.body.appendChild(timeline.dom);

  webgl.scene.add(new DirectionalLightHelper(light));

  const tracks = [
    new NumberKeyframeTrack('.rotation[x]', [0, 1, 2], [0, Math.PI, 0]),
    new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 2, 0]),
    new NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0.25, 1]),
    new BooleanKeyframeTrack('.material.transparent', [0,1, 2], [true, true, true]),
    new BooleanKeyframeTrack('.material.transparent', [0,1, 2], [true, true, true]),
    new FunctionKeyframeTrack(
      'testingFn',
      [0.75, 1.5, 2],
      ['cambiarColor:red', 'cambiarColor:blue', 'cambiarColor:white'],
    ),
  ];

  timeline.fromArray(tracks);

  Time.on('loop', () => timeline.update(Time.delta));

  webgl.camera.lookAt(box.position);
  webgl.camera.position.set(-2, 2, 15);
}
