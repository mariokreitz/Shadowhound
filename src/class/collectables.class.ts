import { ICollectable, IGame } from "../types/shadowhound";
import { getImage } from "../utils/misc";

class Collectable implements ICollectable {
  constructor(game: IGame) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.image = new Image();
    this.speedX = 0;
    this.speedY = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.markedForDeletion = false;
  }

  game: IGame;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  speedX: number;
  speedY: number;
  frameX: number;
  frameY: number;
  markedForDeletion: boolean;

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
}

export class DogHead extends Collectable {
  constructor(game: IGame) {
    super(game);
    this.width = 50;
    this.height = 50;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = getImage("player-head");
  }
}

export class Heart extends Collectable {
  constructor(game: IGame) {
    super(game);
    this.width = 50;
    this.height = 50;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = getImage("lives");
  }
}
