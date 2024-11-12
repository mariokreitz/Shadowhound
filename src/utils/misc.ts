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
 * Retrieves an HTMLCanvasElement and its associated CanvasRenderingContext2D
 * based on the canvas ID.
 * @param {string} canvasID - The ID of the canvas element to retrieve.
 * @returns {{canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D | null}}
 * An object containing the canvas element and its context.
 */
export function getCanvasAndContext(canvasID: string): {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
} {
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) {
    showError(canvasID);
    return { canvas: null, ctx: null };
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return { canvas, ctx };
}
