import { IGame, ILayer, IBackground, BackgroundConstructorParams } from "../types/shadowhound";
import { getImage } from "../utils/misc";

class Layer implements ILayer {
  constructor({ game, width, height, speedModifier, image }: BackgroundConstructorParams) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }

  game: IGame;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
  x: number;
  y: number;

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(): void {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }
}

export class Background implements IBackground {
  constructor(game: IGame) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
    this.layer5Image = getImage("layer-5");
    this.layer1 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 1,
      image: this.layer5Image,
    });
    this.backgroundLayers = [this.layer1];
  }

  game: IGame;
  width: number;
  height: number;
  layer5Image: HTMLImageElement;
  layer1: ILayer;
  backgroundLayers: ILayer[];

  draw(ctx: CanvasRenderingContext2D): void {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(ctx);
    });
  }
  update(): void {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }
}
