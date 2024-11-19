import { Toast } from "../class/toast.class";
import { volumeIcons, soundIcons, keyboardIcons, exitIcons } from "./svgIcons";

/**
 * Hides the loading screen and shows the menu.
 * @param {string} loadingId - The ID of the HTMLDivElement to hide.
 * @param {string} menuId - The ID of the HTMLDivElement to show.
 */
export function hideLoadingAndShowMenu(loadingId: string, menuId: string): void {
  const loadingElement = document.getElementById(loadingId) as HTMLDivElement;
  const menuElement = document.getElementById(menuId) as HTMLDivElement;

  if (!loadingElement || !menuElement) {
    showError(loadingId);
    showError(menuId);
    return;
  }

  menuElement.style.removeProperty("display");
  loadingElement.style.display = "none";
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
      helpModalCloseBtn: HTMLButtonElement;
      volumeControlButton: HTMLButtonElement;
      soundControlButton: HTMLButtonElement;
      volumeControlMobile: HTMLButtonElement;
    }
  | undefined {
  const startButton = document.getElementById("start-btn") as HTMLButtonElement;
  const helpButton = document.getElementById("help-btn") as HTMLButtonElement;
  const helpModalCloseBtn = document.getElementById("help-modal-close-btn") as HTMLButtonElement;
  const volumeControlButton = document.getElementById("volume-control") as HTMLButtonElement;
  const soundControlButton = document.getElementById("sound-control") as HTMLButtonElement;
  const volumeControlMobile = document.getElementById("volume-control-mobile") as HTMLButtonElement;

  if (
    !startButton ||
    !helpButton ||
    !helpModalCloseBtn ||
    !volumeControlButton ||
    !soundControlButton ||
    !volumeControlMobile
  ) {
    showError("start-btn");
    showError("help-btn");
    showError("help-modal-close-btn");
    showError("volume-control");
    showError("sound-control");
    showError("volume-control-mobile");
    return;
  }

  return { startButton, helpButton, helpModalCloseBtn, volumeControlButton, soundControlButton, volumeControlMobile };
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

  const volumeControlButtonMobile: HTMLButtonElement = document.createElement("button");
  volumeControlButtonMobile.id = "volume-control-mobile";
  volumeControlButtonMobile.innerHTML = volumeIcons.high;
  volumeControlElement.appendChild(volumeControlButtonMobile);

  const volumeControlButton: HTMLButtonElement = document.createElement("button");
  volumeControlButton.id = "volume-control";
  volumeControlButton.innerHTML = volumeIcons.high;
  volumeControlElement.appendChild(volumeControlButton);

  const soundControlButton: HTMLButtonElement = document.createElement("button");
  soundControlButton.id = "sound-control";
  soundControlButton.innerHTML = soundIcons.on;
  volumeControlElement.appendChild(soundControlButton);
}

/**
 * Adds the help modal content to a container element with the given ID.
 * @param {string} modalContentId - The ID of the container element to add the help modal content to.
 * @returns {void}
 */
export function addHelpModalContent(modalContentId: string): void {
  const modalContentElement = document.getElementById(modalContentId) as HTMLDivElement | null;
  if (!modalContentElement) {
    showError(modalContentId);
    return;
  }

  modalContentElement.appendChild(helpModalTemplate());
}

/**
 * Displays the mobile control buttons on the canvas by setting their display style to "flex".
 * If either of the control elements are not found, the function will return without making changes.
 */
export function showMobileControls() {
  const [mobileCanvasControlLeftElement, mobileCanvasControlRightElement, mobileCanvasControlExitElement] =
    getMobileCanvasControlElements();

  if (!mobileCanvasControlLeftElement || !mobileCanvasControlRightElement || !mobileCanvasControlExitElement) return;

  mobileCanvasControlLeftElement.style.removeProperty("display");
  mobileCanvasControlRightElement.style.removeProperty("display");
  mobileCanvasControlExitElement.style.removeProperty("display");
}

/**
 * Hides the mobile control buttons if they exist.
 * @returns {void}
 */
export function hideMobileControls(): void {
  const [mobileCanvasControlLeftElement, mobileCanvasControlRightElement, mobileCanvasControlExitElement] =
    getMobileCanvasControlElements();

  if (!mobileCanvasControlLeftElement || !mobileCanvasControlRightElement || !mobileCanvasControlExitElement) return;

  mobileCanvasControlLeftElement.style.display = "none";
  mobileCanvasControlRightElement.style.display = "none";
  mobileCanvasControlExitElement.style.display = "none";
}

/**
 * Retrieves the mobile control elements from the DOM.
 * @returns {Array<HTMLDivElement | null, HTMLDivElement | null, HTMLButtonElement | null>} - An array with the left, right, and exit mobile control elements, or [null, null, null] if any element is not found.
 */
function getMobileCanvasControlElements(): [HTMLDivElement | null, HTMLDivElement | null, HTMLButtonElement | null] {
  return [
    document.getElementById("mobile-canvas-control-left") as HTMLDivElement | null,
    document.getElementById("mobile-canvas-control-right") as HTMLDivElement | null,
    document.getElementById("mobile-canvas-control-exit") as HTMLButtonElement | null,
  ];
}

/**
 * Adds the mobile control buttons to the page.
 */
export function addMobileControl(): void {
  document.body.appendChild(mobileControlTemplateExit());
  document.body.appendChild(mobileControlTemplateLeft());
  document.body.appendChild(mobileControlTemplateRight());
}

/**
 * Creates and returns a strongly typed HTMLDivElement representing the help modal content.
 * @returns {HTMLDivElement} The help modal content node with the keyboard controls.
 */
function helpModalTemplate(): HTMLDivElement {
  const helpModalContentNode: HTMLDivElement = document.createElement("div");
  helpModalContentNode.id = "help-modal-content";
  helpModalContentNode.innerHTML = /*html*/ `
    <div class="help-modal-keyboard">
      <div class="help-modal-keyboard-cell">
        <h3>Movement</h3>
        <div class="help-modal-keyboard-column">
          <div id="arrowLeft" class="help-modal-keyboard-key">${keyboardIcons.arrowLeft}</div>
          <div class="help-modal-keyboard-key-container">
            <div id="arrowUp" class="help-modal-keyboard-key">${keyboardIcons.arrowUp}</div>
            <div id="arrowDown" class="help-modal-keyboard-key">${keyboardIcons.arrowDown}</div>
          </div>
          <div id="arrowRight" class="help-modal-keyboard-key">${keyboardIcons.arrowRight}</div>
        </div>
      </div>
      <div class="help-modal-keyboard-cell">
        <div style="display: flex; width: 100%; justify-content: space-between">
          <h3>Special Keys</h3>
          <button id="help-modal-close-btn" type="button">&#10006;</button>
        </div>
        <div id="help-moda-special-keys" >
          <div id="d-key" class="help-modal-keyboard-key">${keyboardIcons.d}</div>
          <div id="f-key" class="help-modal-keyboard-key">${keyboardIcons.f}</div>
          <div id="enter" class="help-modal-keyboard-key">${keyboardIcons.enter}</div>
        </div>
      </div>
    </div>
  `;

  return helpModalContentNode;
}

/**
 * Creates and returns a strongly typed div element representing the mobile control buttons for the left side.
 * @returns {HTMLDivElement} The mobile control node with buttons for left, up, down, and right controls.
 */
function mobileControlTemplateLeft(): HTMLDivElement {
  const leftMobileControlNode: HTMLDivElement = document.createElement("div");
  leftMobileControlNode.id = "mobile-canvas-control-left";
  leftMobileControlNode.classList.add("mobile-canvas-control");
  leftMobileControlNode.style.display = "none";
  leftMobileControlNode.innerHTML = /*html*/ `
    <button id="mobile-left" class="mobile-canvas-button" type="button">${keyboardIcons.arrowLeft}</button>
    <div style="display: flex; flex-direction: column; gap: 40px">
      <button id="mobile-up" class="mobile-canvas-button" type="button">${keyboardIcons.arrowUp}</button>
      <button id="mobile-down" class="mobile-canvas-button" type="button">${keyboardIcons.arrowDown}</button>
    </div>
    <button id="mobile-right" class="mobile-canvas-button" type="button">${keyboardIcons.arrowRight}</button>
  `;

  return leftMobileControlNode;
}

/**
 * Creates and returns a strongly typed HTMLDivElement representing the mobile control buttons for the right side.
 * @returns {HTMLDivElement} The mobile control node with a button for special actions.
 */
function mobileControlTemplateRight(): HTMLDivElement {
  const rightMobileControlNode: HTMLDivElement = document.createElement("div");
  rightMobileControlNode.id = "mobile-canvas-control-right";
  rightMobileControlNode.classList.add("mobile-canvas-control");
  rightMobileControlNode.style.display = "none";
  rightMobileControlNode.innerHTML = /*html*/ `
    <button id="mobile-enter" class="mobile-canvas-button" type="button">${keyboardIcons.enter}</button>
  `;
  return rightMobileControlNode;
}

function mobileControlTemplateExit(): HTMLButtonElement {
  const exitMobileControlNode: HTMLButtonElement = document.createElement("button");
  exitMobileControlNode.id = "mobile-canvas-control-exit";
  exitMobileControlNode.classList.add("mobile-canvas-button");
  exitMobileControlNode.style.display = "none";
  exitMobileControlNode.innerHTML = exitIcons.walkinPerson;

  return exitMobileControlNode;
}
