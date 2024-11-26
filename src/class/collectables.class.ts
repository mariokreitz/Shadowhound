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
    this.markedForDeletion = false;
  }

  game: IGame;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  markedForDeletion: boolean;

  draw(ctx: CanvasRenderingContext2D) {}

  update() {}
}

export class DogHead extends Collectable {
  constructor(game: IGame) {
    super(game);

    this.image = getImage("player-head");
  }
}
