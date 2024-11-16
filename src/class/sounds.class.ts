import { ISound } from "../types/shadowhound";
import { getAudioElement } from "../utils/misc";

class Sound implements ISound {
  constructor(audioFile: HTMLAudioElement) {
    this.audioFile = audioFile;
    this.audioFile.muted = true;
    this.audioFile.loop = false;
    this.audioFile.volume = 0;
    this.volumeState = ["high", "low", "off"];
    this.currentVolumeState = 0;
  }

  start(): void {
    this.audioFile.muted = false;
    this.audioFile.play().catch((err) => {
      console.warn(err);
    });
  }

  stop(): void {
    this.audioFile.pause();
    this.audioFile.currentTime = 0;
    this.audioFile.muted = true;
  }

  audioFile: HTMLAudioElement;
  volumeState: string[];
  currentVolumeState: number;
}

export class MenuMusic extends Sound {
  constructor() {
    super(getAudioElement("game-menu-music"));
    this.audioFile.volume = 0.8;
  }

  start() {
    document.addEventListener(
      "click",
      () => {
        this.audioFile.muted = false;
        this.audioFile.loop = true;
        super.start();
      },
      { once: true }
    );
  }
}

export class MenuHoverEffect extends Sound {
  constructor() {
    super(getAudioElement("ui-hover-sound"));
    this.audioFile.volume = 0.6;
  }
}

export class MenuClickEffect extends Sound {
  constructor() {
    super(getAudioElement("ui-click-sound"));
    this.audioFile.volume = 0.6;
  }
}

export class GameMusic extends Sound {
  constructor() {
    super(getAudioElement("game-bg-music"));
    this.audioFile.volume = 0.8;
    this.audioFile.loop = true;
  }
}

export class GameEffect1 extends Sound {
  constructor() {
    super(getAudioElement("game-effect-1"));
    this.audioFile.volume = 0.6;
  }

  private lastPlayTime = 0;
  start(): void {
    const now = performance.now();
    if (now - this.lastPlayTime < Math.random() * 10000 + 30000) return;
    this.lastPlayTime = now;
    super.start();
  }
}

export class PlayerSound extends Sound {
  constructor() {
    super(getAudioElement("test"));
  }
}
