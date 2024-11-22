import { IGame, IInputHandler } from "../types/shadowhound";
import { showError } from "../utils/misc";

/**
 * Handles all user input for the game.
 *
 * @class InputHandler
 * @implements {IInputHandler}
 */
export class InputHandler implements IInputHandler {
  /**
   * The game object.
   * @type {IGame}
   */
  game: IGame;
  /**
   * An array of keys that are currently pressed.
   * @type {string[]}
   */
  keys: string[];

  /**
   * Constructor for the InputHandler class.
   *
   * @param {IGame} game The game object.
   */
  constructor(game: IGame) {
    this.game = game;
    this.keys = [];
    this.addEventListeners();
  }

  /**
   * Adds event listeners to the window for keydown and keyup events.
   */
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
      else if (e.key === "f") {
        const elem = document.getElementById("canvas1");
        if (!elem) return;
        if (elem.requestFullscreen) elem.requestFullscreen();
      } else if (e.key === " ") {
        this.game.stop();
        this.game.reset();
      }
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

    const buttons = [
      "mobile-up",
      "mobile-down",
      "mobile-left",
      "mobile-right",
      "mobile-enter",
      "mobile-canvas-control-exit",
    ];
    buttons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (!button) {
        showError(buttonId);
        return;
      }

      button.addEventListener("touchstart", () => {
        const keyMap: { [key: string]: string } = {
          "mobile-up": "ArrowUp",
          "mobile-down": "ArrowDown",
          "mobile-left": "ArrowLeft",
          "mobile-right": "ArrowRight",
          "mobile-enter": "Enter",
          "mobile-canvas-control-exit": " ",
        };
        const mappedKey = keyMap[buttonId];
        if (mappedKey === " ") {
          this.game.stop();
          this.game.reset();
        }

        if (mappedKey && this.keys.indexOf(mappedKey) === -1) {
          this.keys.push(mappedKey);
        }
      });

      button.addEventListener("touchend", () => {
        const keyMap: { [key: string]: string } = {
          "mobile-up": "ArrowUp",
          "mobile-down": "ArrowDown",
          "mobile-left": "ArrowLeft",
          "mobile-right": "ArrowRight",
          "mobile-enter": "Enter",
          "mobile-canvas-control-exit": " ",
        };
        const mappedKey = keyMap[buttonId];
        if (mappedKey) {
          const index = this.keys.indexOf(mappedKey);
          if (index !== -1) {
            this.keys.splice(index, 1);
          }
        }
      });
    });
  }
}
