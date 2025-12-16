import {
  BooleanKeyframeTrack,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshStandardMaterial,
  NumberKeyframeTrack,
} from 'three';
import { mount } from '../core/utils/three';
import { FunctionKeyframeTrack } from '../core/three/FunctionKeyframeTrack';
import { Time } from '../core/Time';
import TimeLineUI from '../core/ui/TimeLineUI';
import ControlsPlugin from '../core/ui/plugins/ControlsPlugin';
import TracksPlugin from '../core/ui/plugins/TracksPlugin';
import AnimationPlayer from '../core/AnimationPlayer';
import EngineBuilder from '../core/EngineBuilder';

export default {
  start() {
    const app = document.getElementById('app') as HTMLElement;

    class Box extends Mesh<BoxGeometry, MeshStandardMaterial> {
      constructor() {
        super(new BoxGeometry(2, 2, 2), new MeshStandardMaterial({ color: 'white' }));
      }
      cambiarColor(color: string) {
        console.log(color);
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

    const engine = EngineBuilder.create('three', box);
    const timeline = new AnimationPlayer({ duration: 2, engine });
    const timeUI = new TimeLineUI({
      plugins: [new ControlsPlugin(), new TracksPlugin()],
    }).setParent(timeline);

    webgl.scene.add(new DirectionalLightHelper(light));

    const tracks = [
      new NumberKeyframeTrack('.rotation[x]', [0, 1, 2], [0, Math.PI, 0]),
      new NumberKeyframeTrack('.position[y]', [0, 1, 2], [0, 2, 0]),
      new NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0.25, 1]),
      new BooleanKeyframeTrack('.material.transparent', [0, 1, 2], [true, true, true]),
      new FunctionKeyframeTrack('testingFn', [0.6, 2], ['cambiarColor:red', 'cambiarColor:white']),
    ];

    timeline.fromArray(tracks);

    document.body.appendChild(timeUI.dom);

    Time.on('loop', () => timeline.update(Time.delta));

    webgl.camera.lookAt(box.position);
    webgl.camera.position.set(0, 0, 20);
  },
};
