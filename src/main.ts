import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { hideLoadingScreen, getCanvasAndContext } from "./utils/misc";
import { Game } from "./class/game.class";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  const { canvas, ctx } = getCanvasAndContext("canvas1") || { canvas: undefined, ctx: undefined };
  if (!canvas || !ctx) return;

  canvas.width = 500;
  canvas.height = 500;

  const game = new Game(canvas);

  function animate() {
    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    game.update();
    game.draw(ctx!);
    requestAnimationFrame(animate);
  }

  animate();
});
