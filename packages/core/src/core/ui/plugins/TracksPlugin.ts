import type { AnimationEngine } from '@core/AnimationEngine';
import AnimationPlayer from '@core/AnimationPlayer';
import type { TrackLike } from '@core/types';
import type TimeUIPlugin from '@core/types';
import TracksUI from '../components/TrackUI';
import { convertArray } from '@/core/utils';

export default class TracksPlugin implements TimeUIPlugin {
  name = 'TracksPlugin';
  container: TracksUI;

  constructor() {
    this.container = new TracksUI();
    this.displayDom(false);
  }

  onMount() {
    const timeContainerBounds = this.container.timeContainer.dom.getBoundingClientRect();
    this.container.timeContainer.updateRulerHeight(timeContainerBounds.height);
  }

  updateTracks(parent: AnimationPlayer) {
    this.container.clear();
    this.container.setDuration(parent.getDuration());

    const tracks = parent.engine()?.active?.getTracks();

    tracks?.forEach((track, index) => {
      this.container.fromTrack(index, track);
    });
  }

  displayDom(value: boolean) {
    if (value) {
      this.container.dom.style.display = 'flex';
    } else {
      this.container.dom.style.display = 'none';
    }
  }

  onAttach(parent: AnimationPlayer): void {
    const checkClips = () => {
      const clips = parent.engine()?.clips;
      this.displayDom(clips?.length != 0);
    };

    checkClips();

    parent.on('clipAdded', () => checkClips());
    parent.on('clipRemoved', () => checkClips());
    parent.on('clipUpdated', () => checkClips());

    this.container.setDuration(parent.getDuration());
    this.container.timeContainer.rulerTick.setTime(parent.getTime());

    this.container.on('timeupdate', ({ time }) => {
      parent.seek(time);
    });

    this.container.on('trackUpdated', (event: any) => {
      const engine: AnimationEngine | undefined = parent.engine();
      const track: TrackLike | undefined = engine?.active?.getTracks()[event.tPos];
      if (track) {
        const updatedTimes = Array.from(track.times);
        updatedTimes[event.kPos] = event.value;

        if (track.times.constructor) {
          const times = convertArray(updatedTimes, track.times.constructor);
          track.times = times;
        } else {
          track.times = updatedTimes;
        }

        engine?.active?.updateTrack(event.tPos, track);
      }
    });

    parent.on('timeUpdate', ({ time }) => {
      this.container.timeContainer.rulerTick.setTime(time);
    });

    parent.on('durationChange', () => {
      this.container.setDuration(parent.getDuration());
      this.updateTracks(parent);
    });

    parent.on('switchActive', ({ clip }) => {
      this.updateTracks(parent);

      clip.on('trackAdded', () => this.updateTracks(parent));
      clip.on('trackRemoved', () => this.updateTracks(parent));
      clip.on('trackUpdated', () => this.updateTracks(parent));
    });
  }

  render(): TracksUI {
    return this.container;
  }
}
