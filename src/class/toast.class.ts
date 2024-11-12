import { IToast, ToastOptions } from "./../types/toast.ts";

/**
 * The Toast class implements the IToast interface and provides a service for displaying temporary messages on the screen.
 */
export class Toast implements IToast {
  toasts: ToastOptions[] = [];
  timeout: number | null = null;

  constructor() {}

  /**
   * Adds a toast message to the service.
   * @param {string} message - The text of the toast message.
   * @param {number} [duration=30000] - The duration of the toast message in milliseconds.
   */
  add(message: string, duration: number = 30000): void {
    this.toasts.push({ message, duration });
    this.show();
  }

  /**
   * Shows the toast message.
   */
  show(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const toast = this.toasts.shift();
    if (toast) {
      const toastElement = document.createElement("div");
      toastElement.classList.add("toast");
      toastElement.innerText = toast.message;
      document.body.appendChild(toastElement);
      setTimeout(() => {
        toastElement.remove();
        this.timeout = setTimeout(() => this.show(), 100);
      }, toast.duration);
    }
  }
}
