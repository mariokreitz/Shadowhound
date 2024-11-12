import { IInputHandler } from "../types/shadowhound";

export class InputHandler implements IInputHandler {
  constructor() {
    this.keys = [];
    this.addEventListeners();
  }

  keys: string[];

  addEventListeners(): void {
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Enter") &&
        this.keys.indexOf(e.key) === -1
      )
        this.keys.push(e.key);
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Enter"
      )
        this.keys.splice(this.keys.indexOf(e.key), 1);
    });
  }
}
