import { keyboardIcons, exitIcons } from "./svgIcons";

/**
 * Creates and returns a strongly typed HTMLDivElement representing the help modal content.
 * @returns {HTMLDivElement} The help modal content node with the keyboard controls.
 */ export function helpModalTemplate(): HTMLDivElement {
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
export function mobileControlTemplateLeft(): HTMLDivElement {
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
export function mobileControlTemplateRight(): HTMLDivElement {
  const rightMobileControlNode: HTMLDivElement = document.createElement("div");
  rightMobileControlNode.id = "mobile-canvas-control-right";
  rightMobileControlNode.classList.add("mobile-canvas-control");
  rightMobileControlNode.style.display = "none";
  rightMobileControlNode.innerHTML = /*html*/ `
      <button id="mobile-enter" class="mobile-canvas-button" type="button">${keyboardIcons.enter}</button>
    `;
  return rightMobileControlNode;
}

/**
 * Creates and returns a strongly typed HTMLButtonElement representing the exit button
 * for mobile controls. This button is initially hidden and styled as a mobile canvas button.
 * The button displays the 'walkinPerson' icon from the exitIcons collection.
 * @returns {HTMLButtonElement} The exit mobile control button.
 */
export function mobileControlTemplateExit(): HTMLButtonElement {
  const exitMobileControlNode: HTMLButtonElement = document.createElement("button");
  exitMobileControlNode.id = "mobile-canvas-control-exit";
  exitMobileControlNode.classList.add("mobile-canvas-button");
  exitMobileControlNode.style.display = "none";
  exitMobileControlNode.innerHTML = exitIcons.walkinPerson;

  return exitMobileControlNode;
}
