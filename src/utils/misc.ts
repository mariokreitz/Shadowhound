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

  loadingElement.classList.add("d_none");
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
