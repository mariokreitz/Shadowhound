import { IGame, IPlayer } from "../types/shadowhound";

export class Player implements IPlayer {
  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(game: IGame) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = 100;
  }
  update() {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
