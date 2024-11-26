import { ISound } from "../types/shadowhound";
import { getAudioElement } from "../utils/misc";

/**
 * Class that implements the ISound interface and provides a service for sounds in the game.
 */
class Sound implements ISound {
  /**
   * Constructor for the Sound class.
   * @param {HTMLAudioElement} audioFile - The audio element for the sound.
   */
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

  /**
   * Unmutes the audio file and starts playing the sound.
   * If an error occurs during playback, it logs a warning to the console.
   */
  start(): void {
    this.audioFile.muted = false;
    this.audioFile.play().catch((err) => {
      console.warn(err);
    });
  }

  /**
   * Pauses the audio playback, resets the current time to the beginning,
   * and mutes the audio file.
   */
  stop(): void {
    this.audioFile.pause();
    this.audioFile.currentTime = 0;
    this.audioFile.muted = true;
  }

  /**
   * Cycles through the volume states of the audio file and updates the volume.
   *
   * Changes the current volume state to the next in the `volumeStates` array.
   * Sets the audio file's volume based on the new `currentVolumeState`:
   * - "high": Sets volume to 1 (maximum).
   * - "low": Sets volume to 0.5.
   * - "off": Mutes the audio (volume 0).
   */
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

  /**
   * Toggles the mute state of the audio file.
   *
   * If the audio is currently muted, this method will unmute it and set the volume to 0.6.
   * If the audio is not muted, this method will mute it and set the volume to 0.
   */
  toggleMute(): void {
    const isMuted = (this.audioFile.muted = !this.audioFile.muted);
    this.audioFile.volume = isMuted ? 0 : 0.6;
  }
}

/**
 * Creates a new Sound instance.
 *
 * @param {HTMLAudioElement} audioFile - The audio element for the sound.
 * @returns {Sound} A new Sound instance.
 */
export class MenuMusic extends Sound {
  /**
   * Creates a new MenuMusic instance.
   *
   * @param {HTMLAudioElement} audioFile - The audio element for the sound.
   */
  constructor() {
    super(getAudioElement("game-menu-music"));
    this.audioFile.volume = 0.6;
  }

  /**
   * Starts playing the menu music when a click event occurs.
   *
   * The music is unmuted, set to loop, and the sound starts playing.
   * This event listener is only triggered once per page load.
   */
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

/**
 * A class for the menu music.
 *
 * @extends Sound
 */
export class MenuHoverEffect extends Sound {
  /**
   * Constructor for the MenuHoverEffect class.
   *
   * @param {HTMLAudioElement} audioFile - The audio element for the sound.
   */
  constructor() {
    super(getAudioElement("ui-hover-sound"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.6;
  }

  /**
   * Cycles through the volume states of the audio file and updates the volume.
   *
   * Changes the current volume state to the next in the `volumeStates` array.
   * Sets the audio file's volume based on the new `currentVolumeState`:
   * - "high": Sets volume to 0.8.
   * - "low": Sets volume to 0.4.
   * - "off": Mutes the audio (volume 0).
   */
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

/**
 * Class for the menu hover effect sound.
 *
 * @class
 * @extends Sound
 */
export class MenuClickEffect extends Sound {
  /**
   * Initializes the menu click effect sound.
   *
   * Retrieves the "ui-click-sound" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.6.
   */
  constructor() {
    super(getAudioElement("ui-click-sound"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.6;
  }

  /**
   * Adjusts the audio volume based on the current volume state.
   *
   * Inherits the changeVolume behavior from the parent Sound class, then modifies
   * the audio file's volume according to the currentVolumeState:
   * - "high": Sets the volume to 0.6.
   * - "low": Sets the volume to 0.2.
   * - "off": Mutes the audio (volume 0).
   */
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

/**
 * Adjusts the audio volume based on the current volume state.
 *
 * Inherits the changeVolume behavior from the parent Sound class, then modifies
 * the audio file's volume according to the currentVolumeState:
 * - "high": Sets the volume to 0.6.
 * - "low": Sets the volume to 0.2.
 * - "off": Mutes the audio (volume 0).
 */
export class GameMusic extends Sound {
  /**
   * Constructor for the GameMusic class.
   *
   * Retrieves the <audio> element with the id "game-bg-music" and passes it to the
   * parent class's constructor. Also sets the volume to 0.6 and sets loop to true.
   */
  constructor() {
    super(getAudioElement("game-bg-music"));
    this.audioFile.volume = 0.6;
    this.audioFile.loop = true;
  }

  /**
   * Toggles the mute state of the game music.
   *
   * If the music is currently muted, this method will unmute it and set the volume to 0.6.
   * If the music is not muted, this method will mute it and set the volume to 0.
   */
  toggleMute(): void {
    this.audioFile.volume = this.audioFile.muted ? 0 : 0.6;
    this.audioFile.muted = !this.audioFile.muted;
  }
}

/**
 * Toggles the mute state of the game music.
 *
 * If the music is currently muted, this method will unmute it and set the volume to 0.6.
 * If the music is not muted, this method will mute it and set the volume to 0.
 */
export class PlayerDiesSoon extends Sound {
  /**
   * Initializes the PlayerDiesSoon sound.
   *
   * Retrieves the "game-effect-1" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.3.
   */
  constructor() {
    super(getAudioElement("game-effect-1"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.3;
  }

  /**
   * Toggles the mute state of the PlayerDiesSoon sound.
   *
   * If the sound is currently muted, this method will unmute it and set the volume to 0.3.
   * If the sound is not muted, this method will mute it and set the volume to 0.
   */
  toggleMute(): void {
    const isMuted = (this.audioFile.muted = !this.audioFile.muted);
    this.audioFile.volume = isMuted ? 0 : 0.3;
  }
}

/**
 * Class that represents the player's death sound.
 *
 * @class PlayerDead
 * @extends Sound
 * @property {HTMLAudioElement} audioFile - The audio element for the player's death sound.
 * @property {boolean} muted - A flag that indicates if the sound is muted.
 * @property {number} volume - The volume of the sound.
 * @method toggleMute - Toggles the mute state of the sound.
 */
export class PlayerDead extends Sound {
  /**
   * Initializes the PlayerDead sound.
   *
   * Retrieves the "character-die-sound" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.5.
   */
  constructor() {
    super(getAudioElement("character-die-sound"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.5;
  }
}

/**
 * Class that represents the explosion sound.
 *
 * @class Explosion
 * @extends Sound
 * @property {HTMLAudioElement} audioFile - The audio element for the explosion sound.
 * @property {boolean} muted - A flag that indicates if the sound is muted.
 * @property {number} volume - The volume of the sound.
 * @method toggleMute - Toggles the mute state of the sound.
 */
export class Explosion extends Sound {
  /**
   * Initializes the Explosion sound.
   *
   * Retrieves the "game-explosion" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.3.
   */
  constructor() {
    super(getAudioElement("game-explosion"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.3;
  }
}

/**
 * Class that represents the heal sound.
 *
 * @class Heal
 * @extends Sound
 * @property {HTMLAudioElement} audioFile - The audio element for the heal sound.
 * @property {boolean} muted - A flag that indicates if the sound is muted.
 * @property {number} volume - The volume of the sound.
 * @method toggleMute - Toggles the mute state of the sound.
 */
export class Heal extends Sound {
  /**
   * Initializes the Heal sound.
   *
   * Retrieves the "character-heal-sound" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.3.
   */
  constructor() {
    super(getAudioElement("character-heal-sound"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.3;
  }
}

/**
 * Class that represents the score up sound.
 *
 * @class ScoreUp
 * @extends Sound
 * @property {HTMLAudioElement} audioFile - The audio element for the score up sound.
 * @property {boolean} muted - A flag that indicates if the sound is muted.
 * @property {number} volume - The volume of the sound.
 * @method toggleMute - Toggles the mute state of the sound.
 */
export class ScoreUp extends Sound {
  /**
   * Initializes the ScoreUp sound.
   *
   * Retrieves the "game-score-up" audio element using the `getAudioElement` function.
   * Sets the audio element's muted property to false and its volume to 0.3.
   */
  constructor() {
    super(getAudioElement("game-score-up"));
    this.audioFile.muted = false;
    this.audioFile.volume = 0.3;
  }
}
