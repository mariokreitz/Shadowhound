import { IGame, IPlayer } from "../types/shadowhound";
import { showError } from "../utils/misc";

export class Player implements IPlayer {
  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  image: HTMLImageElement;

  constructor(game: IGame) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.image = this.getPlayerImage();
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y);
  }

  getPlayerImage(): HTMLImageElement {
    const playerID = "player";
    const playerImage = document.getElementById(playerID) as HTMLImageElement;
    if (!playerImage) {
      showError(playerID);
      return new Image();
    }

    return playerImage;
  }
}
