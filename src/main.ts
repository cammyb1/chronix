import {
  AnimationClip,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
} from 'three';
import { mount } from './three';
import { AnimationMixerPlus } from './animation/AnimationMixerPlus';
import { FunctionKeyframeTrack } from './animation/FunctionKeyframeTrack';

const app = document.getElementById('app') as HTMLElement;

class Box extends Mesh<BoxGeometry, MeshStandardMaterial> {
  constructor() {
    super(new BoxGeometry(2, 2, 2), new MeshStandardMaterial({ color: 'white' }));
  }

  girar() {
    this.rotation.z += Math.PI / 8;
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
    new FunctionKeyframeTrack([0, 1], ['', 'girar']),
    new FunctionKeyframeTrack([1, 1.5, 2], ['cambiarColor:red', 'cambiarColor:blue', '']),
  ];
  const clip = new AnimationClip('test', -1, tracks);
  const action = mixer.clipAction(clip);

  action.play();

  webgl.events.addEventListener('tick', ({ dt }) => {
    mixer.update(dt);
  });

  webgl.camera.lookAt(box.position);
  webgl.camera.position.set(-2, 2, 15);
}
