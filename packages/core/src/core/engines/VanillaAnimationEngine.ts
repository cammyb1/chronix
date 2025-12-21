import { Interpolation, type TrackLike } from '../types';
import { AnimationEngine } from '../AnimationEngine';

export class VanillaAnimationEngine extends AnimationEngine<{}, TrackLike> {
  setTime(t: number) {
    if (!this.root) return;

    const clip = this.active;
    if (clip) {
      for (const track of clip.getTracks()) {
        const value = this.getValueAtTime(track, t);
        this.applyValue(this.root, track.name, value);
      }
    }
    super.setTime(t);
  }

  getDuration(): number {
    let max = 0;
    const clip = this.active;
    if (clip) {
      for (const track of clip.getTracks()) {
        const lastTime = track.times[track.times.length - 1];
        if (lastTime > max) max = lastTime;
      }
    }
    return max;
  }

  private getValueAtTime(track: TrackLike, time: number): any {
    const times = track.times;
    const values = track.values;

    if (times.length === 0) return undefined;
    if (time <= times[0]) return values[0];
    if (time >= times[times.length - 1]) return values[values.length - 1];

    // Find the index of the keyframe just before the current time
    let i = 0;
    while (i < times.length - 1 && time > times[i + 1]) {
      i++;
    }

    const valueStart = values[i];
    const valueEnd = values[i + 1];
    const timeStart = times[i];
    const timeEnd = times[i + 1];

    const interpolation = track.interpolation ?? Interpolation.LINEAR;

    if (
      interpolation === Interpolation.DISCRETE ||
      typeof valueStart !== 'number' ||
      typeof valueEnd !== 'number'
    ) {
      return valueStart;
    }

    // Linear interpolation for numbers
    const alpha = (time - timeStart) / (timeEnd - timeStart);
    return valueStart + (valueEnd - valueStart) * alpha;
  }

  private applyValue(target: any, property: string, value: any) {
    const parts = property.split('.').filter((s) => s);
    let current = target;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined) return; // Path doesn't exist
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    if (current && current[lastPart] !== undefined) {
      current[lastPart] = value;
    }
  }
}
