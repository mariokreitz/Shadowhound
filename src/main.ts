import "./styles/font.css";
import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import { toggleMenu, hideLoadingScreen, getCanvasAndContext, getMenuElements } from "./utils/misc";
import { Game } from "./class/game.class";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  document.getElementById("main-menu")?.style.removeProperty("display");

  const { canvas, ctx } = getCanvasAndContext("canvas1") || {};
  if (!canvas || !ctx) return;

  const { startBtn, helpBtn } = getMenuElements() || {};
  if (!startBtn || !helpBtn) return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height, ctx);

  startBtn.addEventListener("click", () => {
    game.start();
    toggleMenu("main-menu");
    canvas.style.border = "5px solid black";
  });
});
