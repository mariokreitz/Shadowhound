import { IGame, IUI } from "../types/shadowhound";
import { getImage, hideMobileControls, toggleMenu } from "../utils/misc";

export class UI implements IUI {
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
      ctx.fillText(`Score: ${score}`, game.width - 130, 120);
    }

    // lives
    for (let index = 0; index < lives; index++) {
      ctx.drawImage(liveImage, 25 * index + 20, 20, 25, 25);
    }

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
          clearInterval(intervalId);
        }, 3250);
      }
    }
    ctx.restore();
  }
}
