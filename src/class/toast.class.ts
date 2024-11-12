import { ToastOptions } from "./../types/toast.ts";

export class Toast {
  toasts: ToastOptions[] = [];
  timeout: number | null = null;

  constructor() {}

  add(message: string, duration: number = 3000) {
    this.toasts.push({ message, duration });
    this.show();
  }

  show() {
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
