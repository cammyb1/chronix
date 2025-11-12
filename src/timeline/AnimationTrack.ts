import type { KeyframeTrack } from 'three';

export class AnimationTrack {
  root: KeyframeTrack;

  constructor(root: KeyframeTrack) {
    this.root = root;
  }

  ui(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `
      <div>
        <
      </div>
    `;
    return div;
  }
}
