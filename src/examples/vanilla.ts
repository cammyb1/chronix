import AnimationPlayer from '../core/AnimationPlayer';
import EngineBuilder from '../core/EngineBuilder';
import { Time } from '../core/Time';
import ControlsPlugin from '../core/ui/plugins/ControlsPlugin';
import TracksPlugin from '../core/ui/plugins/TracksPlugin';
import TimeLineUI from '../core/ui/TimeLineUI';

export default {
  start() {
    const app = document.getElementById('app') as HTMLElement;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const refreshScreen = function () {
      if (!ctx) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const drawRect = function (position: { x: number; y: number }, deg: number = 0) {
      if (!ctx) return;
      const width = 250;
      const height = 250;
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.translate(position.x + width / 2, position.y + height / 2);
      ctx.rotate(deg);
      ctx.fillRect((width / 2) * -1, (height / 2) * -1, width, height);
      ctx.restore();
    };

    app.appendChild(canvas);

    const test = {
      position: { x: 500, y: 500 },
      name: 'Hola',
      rotation: 0,
      visible: false,
    };

    const engine = EngineBuilder.create('vanilla', test);
    const timeline = new AnimationPlayer({ duration: 2, engine });
    const timeUI = new TimeLineUI({
      plugins: [new ControlsPlugin(), new TracksPlugin()],
    }).setParent(timeline);

    const tracks = [
      {
        name: 'position.x',
        times: [0, 1, 2],
        values: [500, 700, 500],
      },
      {
        name: 'rotation',
        times: [0, 1, 2],
        values: [0, Math.PI / 2, 0],
      },
      { name: 'name', times: [1, 2], values: ['Pepito', 'Hola'] },
    ];

    timeline.fromArray(tracks);
    timeline.loop = true;

    document.body.appendChild(timeUI.dom);

    Time.start();

    Time.on('loop', () => {
      refreshScreen();
      drawRect(test.position, test.rotation);
      timeline.update(Time.delta);
    });
  },
};
