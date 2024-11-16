import "./styles/font.css";
import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import {
  toggleMenu,
  hideLoadingScreen,
  getCanvasAndContext,
  getMenuElements,
  addVolumeControl,
  toggleVolume,
} from "./utils/misc";
import { Game } from "./class/game.class";
import { soundIcons, volumeIcons } from "./utils/svgIcons";

window.addEventListener("load", function () {
  hideLoadingScreen("loading");
  addVolumeControl("controls");
  document.getElementById("main-menu")?.style.removeProperty("display");

  const { canvas, ctx } = getCanvasAndContext("canvas1") || {};
  if (!canvas || !ctx) return;

  const { startButton, helpButton, soundControlButton, volumeControlButton } = getMenuElements() || {};
  if (!startButton || !helpButton || !soundControlButton || !volumeControlButton) return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height, ctx);
  game.menuMusic.start();

  startButton.addEventListener("click", () => {
    game.start();
    toggleMenu("main-menu");
    canvas.style.border = "5px solid black";
  });

  volumeControlButton.addEventListener("click", () => {
    toggleVolume(game.menuClickEffect);
    toggleVolume(game.menuHoverEffect);
    if (game.menuClickEffect.currentVolumeState == 1) volumeControlButton.innerHTML = volumeIcons.low;
    else if (game.menuClickEffect.currentVolumeState == 2) volumeControlButton.innerHTML = volumeIcons.off;
    else volumeControlButton.innerHTML = volumeIcons.high;
  });

  soundControlButton.addEventListener("click", () => {
    toggleVolume(game.gameMusic);
    toggleVolume(game.menuMusic);

    if (game.menuMusic.currentVolumeState == 2) soundControlButton.innerHTML = soundIcons.off;
    else soundControlButton.innerHTML = soundIcons.on;
  });

  [startButton, helpButton, soundControlButton, volumeControlButton].forEach((button) => {
    if (button.id !== "sound-control" && button.id !== "volume-control") {
      button.addEventListener("mouseover", () => {
        if (button.disabled) return;
        game.menuHoverEffect.start();
      });
    }
    button.addEventListener("click", () => {
      if (button.disabled) return;
      button.disabled = true;
      game.menuClickEffect.start();
      game.menuClickEffect.audioFile.addEventListener(
        "ended",
        () => {
          button.disabled = false;
        },
        { once: true }
      );
      game.menuClickEffect.start();
    });
  });
});
