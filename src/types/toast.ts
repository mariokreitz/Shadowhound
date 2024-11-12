/**
 * The Toast interface represents a service for displaying temporary messages on the screen.
 * @interface
 */
export interface IToast {
  /**
   * Array of toast messages.
   */
  toasts: ToastOptions[];
  /**
   * The timeout ID of the delayed function call.
   */
  timeout: number | null;
  /**
   * Adds a toast message to the service.
   * @param {string} message - The text of the toast message.
   * @param {number} [duration=30000] - The duration of the toast message in milliseconds.
   */
  add(message: string, duration: number): void;
  /**
   * Shows the toast message.
   */
  show(): void;
}

/**
 * Options for the toast message.
 * @typedef {Object} ToastOptions
 * @property {string} message - The text of the toast message.
 * @property {number} duration - The duration of the toast message in milliseconds.
 */
export type ToastOptions = {
  message: string;
  duration: number;
};
