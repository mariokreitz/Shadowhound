import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { Toast } from "./class/toast.class";
import { IGame, CanvasDimensions } from "./types/shadowhound";
import { Player } from "./class/player.class";

window.addEventListener("load", function () {
  const canvasID = "canvas1";
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) {
    const toast = new Toast();
    toast.add(`id: ${canvasID} not found`, 30000);
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = 500;
  canvas.height = 500;

  class Game implements IGame {
    width: number;
    height: number;
    player: Player;

    constructor({ width, height }: CanvasDimensions) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }

    update() {
      // Implementation for updating the game state
    }

    draw() {
      // Implementation for drawing the game on the canvas
      this.player.draw(ctx);
    }
  }

  const game = new Game({ width: canvas.width, height: canvas.height });
  game.draw();
});
