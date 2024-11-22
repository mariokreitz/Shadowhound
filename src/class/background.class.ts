import { IGame, ILayer, IBackground, BackgroundConstructorParams } from "../types/shadowhound";
import { getImage } from "../utils/misc";

/**
 * Layer class for the background.
 *
 * @class Layer
 * @implements {ILayer}
 * @property {IGame} game - The game object.
 * @property {number} width - The width of the layer.
 * @property {number} height - The height of the layer.
 * @property {number} speedModifier - The speed modifier for the layer.
 * @property {HTMLImageElement} image - The image element for the layer.
 * @property {number} x - The x position of the layer.
 * @property {number} y - The y position of the layer.
 */
class Layer implements ILayer {
  /**
   * Creates a new layer.
   *
   * @param {BackgroundConstructorParams} params - The parameters for the layer.
   */
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

  /**
   * Draws the layer.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }

  /**
   * Updates the layer.
   */
  update(): void {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }
}

/**
 * Background class.
 *
 * @class Background
 * @implements {IBackground}
 * @property {IGame} game - The game object.
 * @property {number} width - The width of the background.
 * @property {number} height - The height of the background.
 * @property {HTMLImageElement} layer1Image - The image element for layer 1.
 * @property {HTMLImageElement} layer2Image - The image element for layer 2.
 * @property {HTMLImageElement} layer3Image - The image element for layer 3.
 * @property {HTMLImageElement} layer4Image - The image element for layer 4.
 * @property {HTMLImageElement} layer5Image - The image element for layer 5.
 * @property {ILayer} layer1 - Layer 1.
 * @property {ILayer} layer2 - Layer 2.
 * @property {ILayer} layer3 - Layer 3.
 * @property {ILayer} layer4 - Layer 4.
 * @property {ILayer} layer5 - Layer 5.
 * @property {ILayer[]} backgroundLayers - The layers of the background.
 */
export class Background implements IBackground {
  /**
   * Creates a new background.
   *
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
    this.layer1Image = getImage("layer-1");
    this.layer2Image = getImage("layer-2");
    this.layer3Image = getImage("layer-3");
    this.layer4Image = getImage("layer-4");
    this.layer5Image = getImage("layer-5");
    this.layer1 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 0,
      image: this.layer1Image,
    });
    this.layer2 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 0.1,
      image: this.layer2Image,
    });
    this.layer3 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 0.2,
      image: this.layer3Image,
    });
    this.layer4 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 0.4,
      image: this.layer4Image,
    });
    this.layer5 = new Layer({
      game: this.game,
      width: this.width,
      height: this.height,
      speedModifier: 1,
      image: this.layer5Image,
    });
    this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
  }
  game: IGame;
  width: number;
  height: number;
  layer1Image: HTMLImageElement;
  layer2Image: HTMLImageElement;
  layer3Image: HTMLImageElement;
  layer4Image: HTMLImageElement;
  layer5Image: HTMLImageElement;
  layer1: ILayer;
  layer2: ILayer;
  layer3: ILayer;
  layer4: ILayer;
  layer5: ILayer;
  backgroundLayers: ILayer[];

  /**
   * Draws the background.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(ctx);
    });
  }

  /**
   * Updates the background.
   */
  update(): void {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }
}
