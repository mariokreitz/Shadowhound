import { ICollectable, IGame } from "../types/shadowhound";
import { getImage } from "../utils/misc";

/**
 * A collectable item in the game.
 *
 * @class Collectable
 * @implements {ICollectable}
 * @property {IGame} game - The game object.
 * @property {number} x - The x position of the collectable.
 * @property {number} y - The y position of the collectable.
 * @property {number} width - The width of the collectable.
 * @property {number} height - The height of the collectable.
 * @property {HTMLImageElement} image - The image element for the collectable.
 * @property {number} speedX - The x speed of the collectable.
 * @property {number} speedY - The y speed of the collectable.
 */
class Collectable implements ICollectable {
  /**
   * Constructs an instance of the Collectable class.
   *
   * @param {IGame} game - The game object.
   * @property {IGame} game - The game object.
   * @property {number} x - The initial x position of the collectable.
   * @property {number} y - The initial y position of the collectable.
   * @property {number} width - The initial width of the collectable.
   * @property {number} height - The initial height of the collectable.
   * @property {HTMLImageElement} image - The image element for the collectable.
   * @property {number} speedX - The x speed of the collectable.
   * @property {number} speedY - The y speed of the collectable.
   * @property {number} frameX - The x position of the frame.
   * @property {number} frameY - The y position of the frame.
   * @property {boolean} markedForDeletion - Indicates if the collectable is marked for deletion.
   */
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

  /**
   * Draws the collectable on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @remarks
   * - If the game is in debug mode, a rectangle is drawn around the collectable's bounding box.
   * - The collectable image is drawn on the canvas at its current position.
   */
  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }

  /**
   * Updates the position of the collectable.
   *
   * @remarks
   * - Decreases the x position by the sum of speedX and the game's speed.
   * - Increases the y position by speedY.
   * - Marks the collectable for deletion if it moves out of the screen on the left.
   */
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }
}

/**
 * DogHead class, a type of collectable in the game.
 *
 * @class DogHead
 * @extends Collectable
 * @param {IGame} game - The game object.
 * @property {number} width - The width of the DogHead.
 * @property {number} height - The height of the DogHead.
 * @property {number} x - The x position of the DogHead.
 * @property {number} y - The y position of the DogHead.
 * @property {HTMLImageElement} image - The image element for the DogHead.
 */
export class DogHead extends Collectable {
  /**
   * Constructs an instance of the DogHead class.
   *
   * @param {IGame} game - The game object.
   * @property {number} width - The width of the DogHead.
   * @property {number} height - The height of the DogHead.
   * @property {number} x - The x position of the DogHead.
   * @property {number} y - The y position of the DogHead.
   * @property {HTMLImageElement} image - The image element for the DogHead.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 50;
    this.height = 50;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = getImage("player-head");
  }
}

/**
 * Heart class, a type of collectable in the game.
 *
 * @class Heart
 * @extends Collectable
 * @param {IGame} game - The game object.
 * @property {number} width - The width of the Heart.
 * @property {number} height - The height of the Heart.
 * @property {number} x - The x position of the Heart.
 * @property {number} y - The y position of the Heart.
 * @property {HTMLImageElement} image - The image element for the Heart.
 */
export class Heart extends Collectable {
  /**
   * Constructs an instance of the Heart class.
   *
   * @param {IGame} game - The game object.
   * @property {number} width - The width of the Heart.
   * @property {number} height - The height of the Heart.
   * @property {number} x - The x position of the Heart.
   * @property {number} y - The y position of the Heart.
   * @property {HTMLImageElement} image - The image element for the Heart.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 50;
    this.height = 50;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = getImage("lives");
  }

  /**
   * Draws the Heart collectable on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @remarks
   * - If the game is in debug mode, a rectangle is drawn around the Heart's bounding box.
   * - The Heart image is drawn on the canvas at its current position.
   */
  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y + 15, 35, 35);
  }
}
