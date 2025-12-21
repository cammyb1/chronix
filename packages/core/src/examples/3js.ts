import {
  BooleanKeyframeTrack,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
  NumberKeyframeTrack,
} from 'three';
import { mount } from '../three/utils';
import { Time } from '../core/Time';
import TimeLineUI from '../core/ui/TimeLineUI';
import ControlsPlugin from '../core/ui/plugins/ControlsPlugin';
import TracksPlugin from '../core/ui/plugins/TracksPlugin';
import AnimationPlayer from '../core/AnimationPlayer';
import { ThreeAnimationEngine } from '../core/engines/ThreeAnimationEngine';
import { FunctionKeyframeTrack } from '@/three/FunctionKeyframeTrack';

AnimationPlayer.registerEngine('three', ThreeAnimationEngine);

export default {
  start() {
    const app = document.getElementById('app') as HTMLElement;

    class Box extends Mesh<BoxGeometry, MeshStandardMaterial> {
      constructor() {
        super(new BoxGeometry(2, 2, 2), new MeshStandardMaterial({ color: 'white' }));
      }
      cambiarColor(color: string) {
        this.material.color.set(color);
      }
      consolear() {
        console.log('test console');
      }
    }

    const webgl = mount(app);

    webgl.init();

    const box = new Box();
    const light = new DirectionalLight('#ffffff', 4);

    webgl.scene.add(box);
    webgl.scene.add(light);

    light.position.y = 3;
    light.position.z = 15;

    const timeline = new AnimationPlayer({ duration: 2, loop: true }).setEngine('three', box);
    const timeUI = new TimeLineUI(timeline).registerPlugins(ControlsPlugin, TracksPlugin);

    const tracks = [
      new NumberKeyframeTrack('.rotation[x]', [0, 1, 2], [0, Math.PI, 0]),
      new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 2, 0]),
      new NumberKeyframeTrack('.material.opacity', [0, 0.5, 1, 1.5, 2], [1, 0, 1, 0, 1]),
      new BooleanKeyframeTrack('.material.transparent', [0], [true]),
      new FunctionKeyframeTrack(
        [0.1, 0.5, 1, 1.5, 1.9],
        ['cambiarColor:white', 'cambiarColor:red', '', 'cambiarColor:white', ''],
      ),
    ];

    const engine = timeline.engine();

    engine?.createClip('test', []);
    engine?.createClip('test2', tracks);

    webgl.scene.add(new DirectionalLightHelper(light));

    document.body.appendChild(timeUI.dom);

    Time.on('loop', () => timeline.update(Time.delta));

    webgl.camera.lookAt(box.position);
    webgl.camera.position.set(0, 0, 20);
  },
};
