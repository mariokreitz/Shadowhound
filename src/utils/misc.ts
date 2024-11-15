import { Toast } from "../class/toast.class";

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
 * Retrieves the start and help button elements from the DOM.
 * @returns An object containing the start and help buttons as HTMLElements, or undefined if any button is not found.
 */
export function getMenuElements(): { startBtn: HTMLElement; helpBtn: HTMLElement } | undefined {
  const startElement = document.getElementById("start-btn");
  const helpElement = document.getElementById("help-btn");

  if (!startElement || !helpElement) {
    showError("<start | help>Btn");
    return;
  }

  return { startBtn: startElement, helpBtn: helpElement };
}
