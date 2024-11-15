import "./styles/reset.css";
import "./styles/font.css";
import "./styles/toast.css";
import "./style.css";
import { toggleMenu, hideLoadingScreen, getCanvasAndContext } from "./utils/misc";
import { Game } from "./class/game.class";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  toggleMenu("mainMenu");
  const { canvas, ctx } = getCanvasAndContext("canvas1") || { canvas: undefined, ctx: undefined };
  if (!canvas || !ctx) return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height, ctx);
  game.start();
});
