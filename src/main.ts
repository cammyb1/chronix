import {
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
  NumberKeyframeTrack,
} from 'three';
import { mount } from './three';
import { AnimationMixerPlus } from './core/AnimationMixerPlus';
import { FunctionKeyframeTrack } from './core/FunctionKeyframeTrack';

import './styles.css';
import { AnimationTimeLine } from './timeline/AnimationTimeLine';

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

  const mixer = new AnimationMixerPlus(box);

  webgl.scene.add(box);
  webgl.scene.add(light);

  light.position.y = 3;
  light.position.z = 15;

  const timeline = new AnimationTimeLine().attach(box);

  document.body.appendChild(timeline.dom);

  webgl.scene.add(new DirectionalLightHelper(light));

  const tracks = [
    new NumberKeyframeTrack('.rotation[x]', [0, 1, 2], [0, Math.PI, 0]),
    new NumberKeyframeTrack('.rotation[z]', [0, 1, 2], [0, Math.PI, 0]),
    new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 2, 0]),
    new FunctionKeyframeTrack(
      'testingFn',
      [0.75, 1.5, 2],
      ['cambiarColor:red', 'cambiarColor:blue', 'cambiarColor:white'],
    ),
  ];
  let scale = 1;

  window.addEventListener('wheel', (e) => {
    const dir = Math.sign(e.deltaY * -0.01);
    scale += 0.25 * dir;

    if (scale > 5) {
      scale = 5;
    }
    if (scale < 0.25) {
      scale = 0.25;
    }

    mixer.timeScale = scale;
    timeline.setTimeScale(mixer.timeScale);
  });

  timeline.fromArray(tracks);

  const action = mixer.clipAction(timeline.clip);
  action.play();

  timeline.on('timeupdate', (e) => {
    mixer.setTime(e.time);
  });

  webgl.camera.lookAt(box.position);
  webgl.camera.position.set(-2, 2, 15);
}
