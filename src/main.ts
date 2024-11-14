import "./styles/reset.css";
import "./styles/font.css";
import "./styles/toast.css";
import "./style.css";
import { hideLoadingScreen, getCanvasAndContext } from "./utils/misc";
import { Game } from "./class/game.class";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  const { canvas, ctx } = getCanvasAndContext("canvas1") || { canvas: undefined, ctx: undefined };
  if (!canvas || !ctx) return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas);
  let lastTime = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    game.update(deltaTime);
    game.draw(ctx!);
    if (!game.gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});
