import type { AnimationEngine } from '@core/AnimationEngine';
import type { TrackLike } from '@core/types';
import TracksUI from '../components/TrackUI';
import { convertArray } from '@/core/utils';
import UIPlugin from './UIPlugin';

export default class TracksPlugin extends UIPlugin<TracksUI> {
  container: TracksUI = new TracksUI();

  init() {
    this.displayDom(false);

    const checkClips = () => {
      const clips = this.parent.engine()?.clips;
      this.displayDom(clips?.length != 0);
    };

    checkClips();

    this.parent.on('clipAdded', () => checkClips());
    this.parent.on('clipRemoved', () => checkClips());
    this.parent.on('clipUpdated', () => checkClips());

    this.container.setDuration(this.parent.getDuration());
    this.container.timeContainer.rulerTick.setTime(this.parent.getTime());

    this.container.on('timeupdate', ({ time }) => {
      this.parent.seek(time);
    });

    this.container.on('trackUpdated', (event: any) => {
      const engine: AnimationEngine | undefined = this.parent.engine();
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

    this.parent.on('timeUpdate', ({ time }) => {
      this.container.timeContainer.rulerTick.setTime(time);
    });

    this.parent.on('durationChange', () => {
      this.container.setDuration(this.parent.getDuration());
      this.updateTracks();
    });

    this.parent.on('switchActive', ({ clip }) => {
      this.updateTracks();

      clip.on('trackAdded', () => this.updateTracks());
      clip.on('trackRemoved', () => this.updateTracks());
      clip.on('trackUpdated', () => this.updateTracks());
    });
  }

  onMount() {
    const timeContainerBounds = this.container.timeContainer.dom.getBoundingClientRect();
    this.container.timeContainer.updateRulerHeight(timeContainerBounds.height);
  }

  updateTracks() {
    this.container.clear();
    this.container.setDuration(this.parent.getDuration());

    const tracks = this.parent.engine()?.active?.getTracks();

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

  render(): TracksUI {
    return this.container;
  }
}
