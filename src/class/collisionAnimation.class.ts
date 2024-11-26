import { ICollisionAnimation, IGame } from "../types/shadowhound";
import { getImage } from "../utils/misc";

/**
 * Collision animation class.
 *
 * @class CollisionAnimation
 * @implements {ICollisionAnimation}
 * @property {IGame} game - The game object.
 * @property {HTMLImageElement} image - The image element for the collision animation.
 * @property {number} spriteWidth - The width of the collision animation sprite.
 * @property {number} spriteHeight - The height of the collision animation sprite.
 * @property {number} sizeModifier - The size modifier for the collision animation.
 * @property {number} width - The width of the collision animation.
 * @property {number} height - The height of the collision animation.
 * @property {number} y - The y position of the collision animation.
 * @property {number} x - The x position of the collision animation.
 * @property {number} frameX - The x position of the current frame of the collision animation.
 * @property {number} frameY - The y position of the current frame of the collision animation.
 * @property {number} fps - The frames per second of the collision animation.
 * @property {number} frameInterval - The frame interval of the collision animation in milliseconds.
 * @property {number} frameTimer - The frame timer of the collision animation.
 * @property {number} maxFrame - The maximum frame of the collision animation.
 * @property {boolean} markedForDelection - The flag to check if the collision animation is marked for deletion.
 * @property {ISound} sound - The sound effect for the collision animation.
 */
export class CollisionAnimation implements ICollisionAnimation {
  /**
   * Constructor for the collision animation class.
   *
   * @param {IGame} game - The game object.
   * @param {number} x - The x position of the collision animation.
   * @param {number} y - The y position of the collision animation.
   */
  constructor(game: IGame, x: number, y: number) {
    this.game = game;
    this.image = getImage("collision");
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = Math.random() * 10 + 5;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.maxFrame = 4;
    this.markedForDelection = false;
  }

  game: IGame;
  image: HTMLImageElement;
  spriteWidth: number;
  spriteHeight: number;
  sizeModifier: number;
  width: number;
  height: number;
  y: number;
  x: number;
  maxFrame: number;
  markedForDelection: boolean;
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;

  /**
   * Draws the collision animation.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  /**
   * Updates the collision animation.
   *
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number) {
    this.x -= this.game.speed;
    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else this.frameTimer += deltaTime;
    if (this.frameX > this.maxFrame) this.markedForDelection = true;
  }
}
