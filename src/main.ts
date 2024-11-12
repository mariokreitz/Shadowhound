import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { hideLoadingScreen, getCanvasAndContext } from "./utils/misc";
import { IGame, IPlayer, CanvasDimensions } from "./types/shadowhound";
import { Player } from "./class/player.class";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  const { canvas, ctx } = getCanvasAndContext("canvas1") || { canvas: undefined, ctx: undefined };
  if (!canvas || !ctx) return;

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
      this.player.update();
    }

    draw(ctx: CanvasRenderingContext2D): void {
      this.player.draw(ctx);
    }
  }

  const game = new Game({ width: canvas.width, height: canvas.height });

  function animate() {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    game.update();
    game.draw(ctx!);
    requestAnimationFrame(animate);
  }

  animate();
});
