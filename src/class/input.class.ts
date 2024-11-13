import { IGame, IInputHandler } from "../types/shadowhound";

export class InputHandler implements IInputHandler {
  constructor(game: IGame) {
    this.game = game;
    this.keys = [];
    this.addEventListeners();
  }
  game: IGame;
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
      else if (e.key === "d") this.game.debug = !this.game.debug;
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
