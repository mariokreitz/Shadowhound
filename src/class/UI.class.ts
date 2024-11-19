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
    ctx.save();
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;
    //score
    ctx.fillText(`Score: ${this.game.score}`, 20, 50);
    // lives
    for (let index = 0; index < this.game.lives; index++) {
      ctx.drawImage(this.liveImage, 25 * index + 20, 65, 25, 25);
    }
    //debug - FPS - TIMER
    if (this.game.debug) {
      //fps
      ctx.font = `${this.fontSize * 0.8}px Arial`;
      ctx.fillText(`FPS: ${Math.round(1000 / deltaTime)}`, this.game.width - 150, 40);
      //timer
      ctx.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, this.game.width - 150, 80);
    }
    //game reset
    if (this.game.isGameReset) {
      hideMobileControls();
      toggleMenu("main-menu");
      ctx.clearRect(0, 0, this.game.width, this.game.height);
    }

    //game over messages
    if (this.game.isGameOver) {
      ctx.textAlign = "center";
      ctx.font = `${this.fontSize * 2}px ${this.fontFamily}`;
      if (this.game.score > this.game.minScore) {
        ctx.fillText("Boo-yah", this.game.width * 0.5, this.game.height * 0.5 - 20);
        ctx.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        ctx.fillText(
          "What are creatures of the night afraid of? YOU!!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        ctx.fillText("Love at first bite?", this.game.width * 0.5, this.game.height * 0.5 - 20);
        ctx.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        ctx.fillText("Nope, better luck next time!", this.game.width * 0.5, this.game.height * 0.5 + 20);
        hideMobileControls();
      }
    }
    ctx.restore();
  }
}
