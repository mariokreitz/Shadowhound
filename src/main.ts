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
  addHelpModalContent,
  addMobileControl,
  showMobileControls,
} from "./utils/misc";
import { Game } from "./class/game.class";
import { soundIcons, volumeIcons } from "./utils/svgIcons";

window.addEventListener("load", function () {
  addVolumeControl("controls");
  addHelpModalContent("help-modal");
  addMobileControl();
  hideLoadingAndShowMenu("loading", "main-menu");

  const { canvas, ctx } = getCanvasAndContext("canvas1") || {};
  if (!canvas || !ctx) return;

  const {
    startButton,
    helpButton,
    exitButton,
    helpModalCloseBtn,
    soundControlButton,
    volumeControlButton,
    volumeControlMobile,
  } = getMenuElements() || {};
  if (
    !startButton ||
    !helpButton ||
    !helpModalCloseBtn ||
    !soundControlButton ||
    !volumeControlButton ||
    !volumeControlMobile ||
    !exitButton
  )
    return;

  canvas.width = 900;
  canvas.height = 500;

  const game = new Game(canvas, ctx);
  game.menuMusic.start();

  startButton.addEventListener("click", () => {
    game.start();
    showMobileControls();
    toggleMenu("main-menu");

    canvas.style.border = "5px solid black";
  });

  exitButton.addEventListener("click", () => {
    game.stop();
    game.reset();
  });

  helpButton.addEventListener("click", () => {
    const helpModal = document.getElementById("help-modal") as HTMLDivElement | null;
    if (helpModal) helpModal.style.display = "flex";
  });

  helpModalCloseBtn.addEventListener("click", () => {
    const helpModal = document.getElementById("help-modal") as HTMLDivElement | null;
    if (helpModal) helpModal.style.display = "none";
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
    game.playerDiesSoon.toggleMute();

    const isNotMuted = game.menuMusic.audioFile.muted;
    soundControlButton.innerHTML = isNotMuted ? soundIcons.off : soundIcons.on;
  });

  [startButton, helpButton, soundControlButton, volumeControlButton, helpModalCloseBtn].forEach((button) => {
    if (button.id !== "sound-control" && button.id !== "volume-control" && button.id !== "help-modal-close-btn") {
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

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      game.gameMusic.stop();
      game.menuMusic.stop();
      game.menuHoverEffect.stop();
      game.menuClickEffect.stop();
      game.playerDiesSoon.stop();
    } else {
      game.gameMusic.start();
      game.menuMusic.start();
    }
  });
});
