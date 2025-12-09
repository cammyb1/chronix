import type { KeyframeTrack, Object3D } from 'three';
import { DivElement } from './BaseUI';
import { TrackControlsUI, TrackSubheaderUI, TracksUI } from './TrackUI';
import { AnimationTimeLine } from '../timeline/AnimationTimeLine';

export interface TimeLineEvents {
  timeupdate: { time: number };
  durationChange: { duration: number };
}

export interface TimeLineParams<T extends Object3D> {
  parent?: AnimationTimeLine<T>;
}

export default class TimeLineUI<T extends Object3D> extends DivElement<TimeLineEvents> {
  tracksContainer: TracksUI;
  tracksControls: TrackControlsUI;
  trackSubHeader: TrackSubheaderUI;
  parent: AnimationTimeLine<T> | undefined;

  constructor({ parent }: TimeLineParams<T> = {}) {
    super();

    this.addClass('timeline-container');
    this.parent = parent;

    this.tracksContainer = new TracksUI();
    this.trackSubHeader = new TrackSubheaderUI();
    this.tracksControls = new TrackControlsUI();

    this.tracksControls.on('updateDuration', (e: { value: number }) => {
      this.setDuration(e.value);

      if (this.parent && this.parent.getDuration() !== e.value) {
        this.setDuration(this.parent.getDuration());
      }
    });

    this.tracksControls.on('play', () => {
      if (this.parent) {
        this.parent.play();
      }
    });

    this.tracksControls.on('pause', () => {
      if (this.parent) {
        this.parent.pause();
      }
    });

    this.tracksControls.on('stop', () => {
      if (this.parent) {
        this.parent.stop();
      }
    });

    this.trackSubHeader.on('timeupdate', (e) => {
      this.trigger('timeupdate', e);
      this.parent?.setTime(e.time);
    });

    this.add(this.tracksControls);
    this.add(this.trackSubHeader);
    this.add(this.tracksContainer);
    this._bindParent();
  }

  setParent(p: AnimationTimeLine<T> | undefined): this {
    if (!p) return this;
    this.parent = p;
    this._bindParent();
    return this;
  }

  getControls(): TrackControlsUI {
    return this.tracksControls;
  }

  private _bindParent() {
    if (this.parent) {
      if (this.parent.getTracks().length > 0) {
        this.removeTracks().registerTracks(this.parent.getTracks());
        this.setDuration(this.parent.getDuration());
      }

      this.parent.on('timeupdate', () => {
        if (this.parent) {
          this.trackSubHeader.setTime(this.parent.getActionTime());
        }
      });

      this.parent.on('updateProps', () => {
        if (!this.parent) return;
        this.removeTracks().registerTracks(this.parent.getTracks());
        this.setDuration(this.parent.getDuration());
      });
    }
  }

  setDuration(n: number) {
    this.tracksContainer.setDuration(n);
    this.trackSubHeader.setDuration(n);
    this.tracksControls.setDurationValue(n);

    this.trigger('durationChange', { duration: n });
  }

  registerTracks(tracks: KeyframeTrack[]): this {
    tracks.forEach((track) => {
      this.tracksContainer.fromTrack(track);
    });
    return this;
  }

  removeTracks(): this {
    this.tracksContainer.clear();
    return this;
  }
}
