import { ISound } from "../types/shadowhound";
import { getAudioElement } from "../utils/misc";

class Sound implements ISound {
  constructor(audioFile: HTMLAudioElement) {
    this.audioFile = audioFile;
    this.audioFile.muted = true;
    this.audioFile.loop = false;
    this.audioFile.volume = 0;
    this.volumeStates = ["high", "low", "off"];
    this.currentVolumeState = this.volumeStates[0];
  }

  audioFile: HTMLAudioElement;
  volumeStates: string[];
  currentVolumeState: string;

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

  changeVolume(): void {
    const currentVolumeIndex = this.volumeStates.indexOf(this.currentVolumeState);
    const nextVolumeIndex = (currentVolumeIndex + 1) % this.volumeStates.length;
    this.currentVolumeState = this.volumeStates[nextVolumeIndex];

    switch (this.currentVolumeState) {
      case "high":
        this.audioFile.volume = 1;
        break;
      case "low":
        this.audioFile.volume = 0.5;
        break;
      case "off":
        this.audioFile.volume = 0;
        break;
    }
  }

  toggleMute(): void {
    const isMuted = (this.audioFile.muted = !this.audioFile.muted);
    this.audioFile.volume = isMuted ? 0 : 0.6;
  }
}

export class MenuMusic extends Sound {
  constructor() {
    super(getAudioElement("game-menu-music"));
    this.audioFile.volume = 0.6;
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

  changeVolume(): void {
    super.changeVolume();
    switch (this.currentVolumeState) {
      case "high":
        this.audioFile.volume = 0.8;
        break;
      case "low":
        this.audioFile.volume = 0.4;
        break;
      case "off":
        this.audioFile.volume = 0;
        break;
    }
  }
}

export class MenuClickEffect extends Sound {
  constructor() {
    super(getAudioElement("ui-click-sound"));
    this.audioFile.volume = 0.6;
  }

  changeVolume(): void {
    super.changeVolume();
    switch (this.currentVolumeState) {
      case "high":
        this.audioFile.volume = 0.6;

        break;
      case "low":
        this.audioFile.volume = 0.2;

        break;
      case "off":
        this.audioFile.volume = 0;

        break;
    }
  }
}

export class GameMusic extends Sound {
  constructor() {
    super(getAudioElement("game-bg-music"));
    this.audioFile.volume = 0.6;
    this.audioFile.loop = true;
  }

  toggleMute(): void {
    this.audioFile.volume = this.audioFile.muted ? 0 : 0.6;
    this.audioFile.muted = !this.audioFile.muted;
  }
}

export class GameEffect1 extends Sound {
  constructor() {
    super(getAudioElement("game-effect-1"));
    this.audioFile.volume = 0.6;
  }

  start(): void {}

  changeVolume(): void {
    super.changeVolume();
  }
}

export class PlayerSound extends Sound {
  constructor() {
    super(getAudioElement("test"));
  }
}
