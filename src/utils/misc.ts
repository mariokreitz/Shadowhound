import { GameMusic, MenuMusic } from "../class/sounds.class";
import { Toast } from "../class/toast.class";
import { volumeIcons, soundIcons } from "./svgIcons";

/**
 * Hides an element with the given ID from the DOM.
 * @param {string} loadingElementID - The ID of the element to hide.
 */
export function hideLoadingScreen(loadingElementID: string): void {
  const loadingElement = document.getElementById(loadingElementID) as HTMLElement;
  if (!loadingElement) {
    showError(loadingElementID);
    return;
  }

  loadingElement.style.display = loadingElement.style.display === "none" ? "" : "none";
}

/**
 * Displays a toast message for an error where an HTMLElement with the given ID was not found.
 * @param {string} id - The ID of the HTMLElement that was not found.
 */
export function showError(id: string): void {
  const toast = new Toast();
  toast.add(`HTMLElement with ID: ${id} was not found.`);
}

/**
 * Retrieves a canvas element and its 2D context based on the given canvas ID.
 * @param {string} canvasId - The ID of the canvas element to retrieve.
 * @returns {{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }} - The HTMLCanvasElement and its 2D context, or undefined if the element was not found.
 */
export function getCanvasAndContext(
  canvasId: string
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | undefined {
  const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvasElement) {
    return;
  }

  const canvasContext = canvasElement.getContext("2d") as CanvasRenderingContext2D;
  return { canvas: canvasElement, ctx: canvasContext };
}

/**
 * Retrieves an image element based on the given ID.
 * @param {string} playerID - The ID of the image element to retrieve.
 * @returns {HTMLImageElement} - The image element if found, otherwise creates a new Image object.
 */
export function getImage(playerID: string): HTMLImageElement {
  const playerImage = document.getElementById(playerID) as HTMLImageElement;
  if (!playerImage) {
    showError(playerID);
    return new Image();
  }

  return playerImage;
}

/**
 * Toggles the display of a menu element with the given ID in the DOM.
 * @param {string} menuId - The ID of the menu element to toggle.
 */
export function toggleMenu(menuId: string): void {
  const menuElement = document.getElementById(menuId);

  if (!menuElement) {
    showError(menuId);
    return;
  }

  menuElement.style.display = menuElement.style.display === "none" ? "" : "none";
}

/**
 * Retrieves the main menu buttons from the DOM.
 * @returns {Object} An object with the start button, help button, volume control button, and sound control button.
 * If any of the buttons are not found, the function will return undefined instead.
 */
export function getMenuElements():
  | {
      startButton: HTMLButtonElement;
      helpButton: HTMLButtonElement;
      volumeControlButton: HTMLButtonElement;
      soundControlButton: HTMLButtonElement;
    }
  | undefined {
  const startButton = document.getElementById("start-btn") as HTMLButtonElement;
  const helpButton = document.getElementById("help-btn") as HTMLButtonElement;
  const volumeControlButton = document.getElementById("volume-control") as HTMLButtonElement;
  const soundControlButton = document.getElementById("sound-control") as HTMLButtonElement;

  if (!startButton || !helpButton || !volumeControlButton || !soundControlButton) {
    return;
  }

  return { startButton, helpButton, volumeControlButton, soundControlButton };
}

/**
 * Retrieves an HTMLAudioElement based on the given ID.
 * @param {string} audioID - The ID of the HTMLAudioElement to retrieve.
 * @returns {HTMLAudioElement} - The HTMLAudioElement if found, otherwise creates a new Audio object.
 */
export function getAudioElement(audioID: string): HTMLAudioElement {
  const audioElement = document.getElementById(audioID) as HTMLAudioElement;
  if (!audioElement) {
    showError(audioID);
    return new Audio();
  }

  return audioElement;
}

/**
 * Adds volume control buttons to a container element with the given ID.
 * @param {string} volumeControlElementId - The ID of the container element to add the buttons to.
 */
export function addVolumeControl(volumeControlElementId: string): void {
  const volumeControlElement = document.getElementById(volumeControlElementId) as HTMLElement | null;
  if (!volumeControlElement) return;

  const volumeControlButton: HTMLButtonElement = document.createElement("button");
  volumeControlButton.id = "volume-control";
  volumeControlButton.classList.add("volume-control");
  volumeControlButton.innerHTML = volumeIcons.high;
  volumeControlElement.appendChild(volumeControlButton);

  const soundControlButton: HTMLButtonElement = document.createElement("button");
  soundControlButton.id = "sound-control";
  soundControlButton.classList.add("volume-control");
  soundControlButton.innerHTML = soundIcons.on;
  volumeControlElement.appendChild(soundControlButton);
}

/**
 * Toggles the volume of the given audio effect.
 * @param {{ currentVolumeState: number, volumeState: string[], audioFile: HTMLAudioElement }} effect - The audio effect to modify.
 * @returns {void}
 */
export function toggleVolume(
  effect:
    | {
        currentVolumeState: number;
        volumeState: string[];
        audioFile: HTMLAudioElement;
      }
    | GameMusic
    | MenuMusic
): void {
  if (effect instanceof GameMusic || effect instanceof MenuMusic) {
    effect.audioFile.volume = effect.audioFile.volume === 0.8 ? 0 : 0.8;
    effect.currentVolumeState =
      effect.audioFile.volume === 0.8 ? effect.volumeState.indexOf("high") : effect.volumeState.indexOf("off");
  } else {
    effect.currentVolumeState = (effect.currentVolumeState + 1) % effect.volumeState.length;
    const currentState = effect.volumeState[effect.currentVolumeState];
    effect.audioFile.volume = currentState === "high" ? 0.6 : currentState === "low" ? 0.3 : 0;
  }
}
