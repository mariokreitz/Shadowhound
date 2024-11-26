import { IGame, IUI } from "../types/shadowhound";
import { getImage, hideMobileControls, toggleMenu } from "../utils/misc";

/**
 * The UI class implements the IUI interface and provides a service for rendering the game user interface.
 *
 * @class
 * @implements {IUI}
 */
export class UI implements IUI {
  /**
   * Initializes a new instance of the UI class.
   *
   * @param {IGame} game - The game object.
   * @property {number} fontSize - The font size for the UI text.
   * @property {string} fontFamily - The font family for the UI text.
   * @property {HTMLImageElement} liveImage - The image element for the lives display.
   */
  constructor(game: IGame) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.liveImage = getImage("lives");
  }

  game: IGame;
  fontSize: number;
  fontFamily: string;
  liveImage: HTMLImageElement;

  /**
   * Renders the game user interface.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} deltaTime - The time difference between the current frame and the last frame.
   */
  draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const { game, fontSize, fontFamily, liveImage } = this;
    const { width, height, fontColor, lives, score, isGameOver, isGameReset } = game;

    ctx.save();
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "left";
    ctx.fillStyle = fontColor;

    // debug UI
    if (game.debug) {
      const fps = Math.round(1000 / deltaTime);
      ctx.fillText(`FPS: ${fps}`, game.width - 130, 60);
      ctx.fillText(`Time: ${(game.time / 1000).toFixed(1)}`, game.width - 130, 90);
    }

    // lives, score and cooldown UI
    for (let index = 0; index < lives; index++) {
      ctx.drawImage(liveImage, 35 * index + 20, 20, 25, 25);
    }
    ctx.fillText(`Score: ${score}`, 20, 80);
    const cooldownBarWidth = 100;
    const cooldownBarHeight = 10;
    const cooldownBarX = 20;
    const cooldownBarY = 100;
    const cooldownPercentage = game.player.onCooldown ? game.player.rollingCooldown / game.player.rollingCooldownInterval : 0;
    // Draw cooldown background
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(cooldownBarX, cooldownBarY, cooldownBarWidth, cooldownBarHeight);
    // Draw cooldown bar
    ctx.fillStyle = "rgba(0, 128, 255, 0.8)";
    ctx.fillRect(cooldownBarX, cooldownBarY, cooldownBarWidth * cooldownPercentage, cooldownBarHeight);
    ctx.fillStyle = fontColor;
    //game reset
    if (isGameReset) {
      hideMobileControls();
      toggleMenu("main-menu");
      ctx.clearRect(0, 0, width, height);
    }

    //game over messages
    if (isGameOver) {
      ctx.textAlign = "center";
      ctx.font = `${fontSize * 2}px ${fontFamily}`;
      if (score >= game.minScore && lives > 0) {
        ctx.save();
        ctx.shadowColor = "rgba(192, 0, 0, 0.8)";
        ctx.fillText("Boo-yah", width * 0.5, height * 0.5 - 20);
        ctx.font = `${fontSize * 0.7}px ${fontFamily}`;
        ctx.fillText("What are creatures of the night afraid of? YOU!!", width * 0.5, height * 0.5 + 20);
        ctx.restore();
        const intervalId = setInterval(() => {
          game.stop();
          game.reset();
          game.isGameOver = false;
          ctx.clearRect(0, 0, width, height);
          toggleMenu("main-menu");
          hideMobileControls();
          clearInterval(intervalId);
        }, 3250);
      } else {
        ctx.save();
        ctx.shadowColor = "rgba(192, 0, 0, 0.8)";
        ctx.fillText("Love at first bite?", width * 0.5, height * 0.5 - 20);
        ctx.font = `${fontSize * 0.7}px ${fontFamily}`;
        ctx.fillText("Nope, better luck next time!", width * 0.5, height * 0.5 + 20);
        ctx.restore();
        const intervalId = setInterval(() => {
          game.stop();
          game.reset();
          game.isGameOver = false;
          ctx.clearRect(0, 0, width, height);
          toggleMenu("main-menu");
          hideMobileControls();
          clearInterval(intervalId);
        }, 3250);
      }
    }
    ctx.restore();
  }
}
