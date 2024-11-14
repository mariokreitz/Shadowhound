import { IGame } from "../types/shadowhound";

export class UI {
  constructor(game: IGame) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
  }

  game: IGame;
  fontSize: number;
  fontFamily: string;

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;
    //score
    ctx.fillText(`Score: ${this.game.score}`, 20, 50);
  }
}
