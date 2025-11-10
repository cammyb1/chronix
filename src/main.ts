import {
  AnimationClip,
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

  webgl.scene.add(new DirectionalLightHelper(light));

  const tracks = [
    new NumberKeyframeTrack('.rotation[x]', [0, 1, 2], [0, Math.PI, 0]),
    new NumberKeyframeTrack('.rotation[z]', [0, 1, 2], [0, Math.PI, 0]),
    new FunctionKeyframeTrack(
      'testing',
      [0.75, 1.5, 2],
      ['cambiarColor:red', 'cambiarColor:blue', 'cambiarColor:white'],
    ),
  ];
  const clip = new AnimationClip('test', -1, tracks);
  const action = mixer.clipAction(clip);

  mixer.timeScale = 0.1;

  action.play();

  webgl.events.on('tick', ({ dt }) => {
    mixer.update(dt);
  });

  webgl.camera.lookAt(box.position);
  webgl.camera.position.set(-2, 2, 15);
}
