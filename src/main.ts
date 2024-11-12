import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { Toast } from "./class/toast.class";
import { IGame, IPlayer, CanvasDimensions } from "./types/shadowhound";
import { Player } from "./class/player.class";

window.addEventListener("load", function () {
  const canvasID = "canvas1";
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) {
    const toast = new Toast();
    toast.add(`id: ${canvasID} not found`, 30000);
    return;
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = 500;
  canvas.height = 500;

  class Game implements IGame {
    width: number;
    height: number;
    player: IPlayer;

    constructor({ width, height }: CanvasDimensions) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }

    update() {
      // Implementation for updating the game state
    }

    draw(ctx: CanvasRenderingContext2D): void {
      this.player.draw(ctx);
    }
  }

  const game = new Game({ width: canvas.width, height: canvas.height });

  function animate() {
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate();
});
