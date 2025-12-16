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

    const root = {
      position: { x: 500, y: 500 },
      name: 'Random',
      textColor: 'white',
      rotation: 0,
      visible: false,
    };

    const refreshScreen = function () {
      if (!ctx) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const drawText = function (text: string, x: number, y: number) {
      if (!ctx) return;
      ctx.font = '48px calibri';
      ctx.fillStyle = root.textColor;
      ctx.fillText(text, x, y);
    };

    const drawRect = function () {
      if (!ctx) return;
      const width = 250;
      const height = 250;
      const x = root.position.x + width / 2;
      const y = root.position.y + height / 2;

      ctx.save();

      const translatedX = (width / 2) * -1;
      const translatedY = (height / 2) * -1;

      ctx.translate(x, y);
      ctx.rotate(root.rotation);
      drawText(root.name, translatedX + 24, translatedY - 24);
      ctx.fillStyle = 'white';
      ctx.fillRect(translatedX, translatedY, width, height);
      ctx.restore();
    };

    app.appendChild(canvas);

    const engine = EngineBuilder.create('vanilla', root);
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
      { name: 'name', times: [0, 1, 1.5], values: ['Jaimito', 'Pepito', 'Juan'] },
      { name: 'textColor', times: [0, 1, 1.5], values: ['red', 'cyan', 'blue'] },
    ];

    timeline.fromArray(tracks);
    timeline.loop = true;

    document.body.appendChild(timeUI.dom);

    Time.start();

    Time.on('loop', () => {
      refreshScreen();
      drawRect();
      timeline.update(Time.delta);
    });
  },
};
