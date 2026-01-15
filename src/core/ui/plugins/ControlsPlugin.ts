import Modal from '../components/Modal';
import { TrackControlsUI } from '../components/TrackControls';
import UIPlugin from './UIPlugin';

export default class ControlsPlugin extends UIPlugin<TrackControlsUI> {
  container: TrackControlsUI = new TrackControlsUI();

  init() {
    this.container.on('play', () => this.player.play());
    this.container.on('pause', () => this.player.pause());
    this.container.on('stop', () => this.player.stop());
    this.container.on('restart', () => this.player.restart());
    this.container.on('updateDuration', ({ value }) => this.player.setDuration(value));

    const newClipModal = new Modal().setTitle('Add new Clip').setInputs([
      { label: 'Name', value: 'name', placeHolder: 'Enter clip name', type: 'text' },
      {
        label: 'Duration',
        value: 'duration',
        placeHolder: '1',
        min: '0',
        max: '20',
        type: 'number',
      },
      { label: 'Loop', value: 'loop', placeHolder: '', type: 'checkbox' },
    ]);

    const removeClipModal = new Modal()
      .setTitle('Remove Clip')
      .setDesc('This action remove the current existing clip');

    newClipModal.on('confirm', ({ data }) => {
      if (Object.keys(data).length > 0) {
        this.player.engine()?.createClip({
          name: data.name.toString(),
          duration:
            typeof data.duration === 'number'
              ? data.duration
              : parseFloat(data.duration.toString()),
          loop: !!data.loop,
        });
      }
      newClipModal.close();
    });

    removeClipModal.on('confirm', () => {
      const engine = this.player.engine();
      if (engine?.active) {
        engine?.removeClip(engine.active?.uuid);
      }
      removeClipModal.close();
    });

    this.container.on('addClip', () => newClipModal.open());
    this.container.on('removeClip', () => removeClipModal.open());

    this.container.setDurationValue(this.player.getDuration());

    this.player.on('clipAdded', ({ clip }) => {
      this.container.names.addOption(clip.name, clip.uuid, false);
    });
    this.player.on('clipRemoved', ({ clip }) => {
      const index = this.container.names.options.findIndex((o) => o.dom.value === clip.uuid);
      this.container.names.removeOption(index);
    });

    this.player.on('durationChange', ({ duration }) => {
      this.container.setDurationValue(duration);
    });

    this.container.on('updateName', ({ value }) => {
      this.player.engine()?.setActiveClip(value);
    });
  }

  render(): TrackControlsUI {
    return this.container;
  }
}
