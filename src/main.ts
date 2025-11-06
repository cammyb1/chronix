import { mount } from "./three";
import "./style.css";
import {
  AnimationClip,
  AnimationMixer,
  BoxGeometry,
  Euler,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  VectorKeyframeTrack,
} from "three";

const root: HTMLElement | null = document.getElementById("app");

if (root) {
  const tjs = mount(root);

  const box = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());

  tjs.scene.add(box);

  const mixer = new AnimationMixer(box);

  tjs.init();

  const q0 = new Quaternion().setFromEuler(new Euler(0, 0, 0)); // 0°
  const q1 = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI)); // 180°
  const q2 = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI * 2));

  const values = [
    q0.x,
    q0.y,
    q0.z,
    q0.w,
    q1.x,
    q1.y,
    q1.z,
    q1.w,
    q2.x,
    q2.y,
    q2.z,
    q2.w,
  ];

  const tracks = [new VectorKeyframeTrack(".quaternion", [0, 1, 6], values)];
  const clip = new AnimationClip("test", -1, tracks);

  tjs.events.addEventListener("tick", ({ dt }) => mixer.update(dt));

  const action = mixer.clipAction(clip);
  action.play();

  tjs.camera.lookAt(box.position);
  tjs.camera.position.set(0, 0, 15);
}
