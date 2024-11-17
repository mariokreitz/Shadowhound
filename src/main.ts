import "./styles/font.css";
import "./styles/reset.css";
import "./styles/toast.css";
import "./style.css";
import {
  toggleMenu,
  hideLoadingAndShowMenu,
  getCanvasAndContext,
  getMenuElements,
  addVolumeControl,
} from "./utils/misc";
import { Game } from "./class/game.class";
import { soundIcons, volumeIcons } from "./utils/svgIcons";

window.addEventListener("load", function () {
  addVolumeControl("controls");
  hideLoadingAndShowMenu("loading", "main-menu");

  const { canvas, ctx } = getCanvasAndContext("canvas1") || {};
  if (!canvas || !ctx) return;

  const { startButton, helpButton, soundControlButton, volumeControlButton, volumeControlMobile } =
    getMenuElements() || {};
  if (!startButton || !helpButton || !soundControlButton || !volumeControlButton || !volumeControlMobile) return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height, ctx);
  game.menuMusic.start();

  startButton.addEventListener("click", () => {
    game.start();
    toggleMenu("main-menu");
    canvas.style.border = "5px solid black";
  });

  volumeControlMobile.addEventListener("click", () => {
    game.menuHoverEffect.toggleMute();
    game.menuClickEffect.toggleMute();

    const isNotMuted = game.menuClickEffect.audioFile.muted;
    volumeControlMobile.innerHTML = isNotMuted ? volumeIcons.off : volumeIcons.high;
  });

  volumeControlButton.addEventListener("click", () => {
    game.menuHoverEffect.changeVolume();
    game.menuClickEffect.changeVolume();

    const volumeState = game.menuClickEffect.currentVolumeState;
    volumeControlButton.innerHTML = volumeIcons[volumeState];
  });

  soundControlButton.addEventListener("click", () => {
    game.gameMusic.toggleMute();
    game.menuMusic.toggleMute();
    game.gameEffect1.toggleMute();

    const isNotMuted = game.menuMusic.audioFile.muted;
    soundControlButton.innerHTML = isNotMuted ? soundIcons.off : soundIcons.on;
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
