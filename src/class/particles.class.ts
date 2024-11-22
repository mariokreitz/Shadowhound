import { IGame, IParticle } from "../types/shadowhound";
import { getImage } from "../utils/misc";

/**
 * Class that represents a particle in the game.
 *
 * @class Particle
 * @implements {IParticle}
 * @property {IGame} game - The game object.
 * @property {number} x - The x position of the particle.
 * @property {number} y - The y position of the particle.
 * @property {number} speedX - The x speed of the particle.
 * @property {number} speedY - The y speed of the particle.
 * @property {number} size - The size of the particle.
 * @property {string} color - The color of the particle.
 * @property {boolean} markedForDelection - A flag that indicates if the particle is marked for deletion.
 */
class Particle implements IParticle {
  /**
   * Creates a new particle.
   *
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    this.game = game;
    this.markedForDelection = false;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.size = 0;
    this.color = "black";
  }

  game: IGame;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  markedForDelection: boolean;

  /**
   * Updates the particle's position and size.
   *
   * @remarks
   * - Subtracts the particle's speedX and the game's speed from the particle's x position.
   * - Subtracts the particle's speedY from the particle's y position.
   * - Multiplies the particle's size by 0.95.
   * - If the particle's size is less than 0.5, marks the particle for deletion.
   */
  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDelection = true;
  }

  /**
   * Draws the particle on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   *
   * @remarks
   * - Uses the 2D drawing context to draw the particle as a circle.
   * - Fills the shape with the particle's color.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

/**
 * Class that represents a particle in the game.
 *
 * @class Particle
 * @implements {IParticle}
 * @property {IGame} game - The game object.
 * @property {number} x - The x position of the particle.
 * @property {number} y - The y position of the particle.
 * @property {number} speedX - The x speed of the particle.
 * @property {number} speedY - The y speed of the particle.
 * @property {number} size - The size of the particle.
 * @property {string} color - The color of the particle.
 * @property {boolean} markedForDelection - A flag that indicates if the particle is marked for deletion.
 */
export class Dust extends Particle {
  /**
   * Constructor for the Dust class.
   *
   * @param {IGame} game - The game object.
   * @param {number} x - The x position of the particle.
   * @param {number} y - The y position of the particle.
   *
   * @remarks
   * - Sets the size of the particle to a random value between 10 and 20.
   * - Sets the x and y positions of the particle.
   * - Sets the x and y speeds of the particle to a random value between 0 and 1.
   * - Sets the color of the particle to a gray color with an alpha value of 0.2.
   */
  constructor(game: IGame, x: number, y: number) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.2)";
  }
}

/**
 * Constructor for the FireBall class.
 *
 * @param {IGame} game - The game object.
 * @param {number} x - The x position of the particle.
 * @param {number} y - The y position of the particle.
 * @param {number} angle - The angle of the particle.
 *
 * @remarks
 * - Sets the size of the particle to 10.
 * - Sets the x and y positions of the particle.
 * - Sets the x and y speeds of the particle based on the angle and a speed of 5.
 * - Sets the color of the particle to a black color with an alpha value of 0.7.
 */
export class FireBall extends Particle {
  /**
   * Constructor for the FireBall class.
   *
   * @param {IGame} game - The game object.
   * @param {number} x - The x position of the particle.
   * @param {number} y - The y position of the particle.
   * @param {number} angle - The angle of the particle in radians.
   *
   * @remarks
   * - Sets the size of the particle to 10.
   * - Sets the x and y positions of the particle.
   * - Sets the x and y speeds of the particle based on the angle and a speed of 5.
   * - Sets the color of the particle to a black color with an alpha value of 0.7.
   */
  constructor(game: IGame, x: number, y: number, angle: number) {
    super(game);
    this.size = 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.cos(angle) * 5;
    this.speedY = Math.sin(angle) * 5;
    this.color = "rgba(0, 0, 0, 0.7)";
  }

  /**
   * Draws the FireBall particle on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   *
   * @remarks
   * - Saves the current canvas state.
   * - Begins a new path and creates an arc at the particle's position.
   * - Sets the fill style to the particle's color and fills the arc.
   * - Sets the stroke style to a light color with some transparency and strokes the arc.
   * - Restores the canvas state.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(240, 240, 240, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Updates the FireBall particle.
   *
   * @remarks
   * - Calls the parent's update method.
   * - Sets the size of the particle to 15.
   * - Checks if the particle is out of bounds and marks it for deletion if so.
   */
  update() {
    super.update();
    this.size = 15;
    if (this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
      this.markedForDelection = true;
    }
  }
}

/**
 * Class representing a Splash particle effect.
 *
 * @class Splash
 * @extends Particle
 * @param {IGame} game - The game object.
 * @param {number} x - The x position of the particle.
 * @param {number} y - The y position of the particle.
 * @property {number} gravity - The gravity affecting the particle.
 * @property {HTMLImageElement} image - The image representing the particle.
 */
export class Splash extends Particle {
  constructor(game: IGame, x: number, y: number) {
    super(game);
    this.size = Math.random() * 100 + 100;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 1;
    this.gravity = 0;
    this.image = getImage("fire");
  }

  gravity: number;
  image: HTMLImageElement;

  /**
   * Updates the Splash particle effect.
   *
   * @remarks
   * - Calls the parent's update method.
   * - Increases the gravity and applies it to the y position.
   */
  update() {
    super.update();
    this.gravity += 0.1;
    this.y += this.gravity;
  }

  /**
   * Draws the Splash particle effect on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

/**
 * Creates a Splash particle effect.
 *
 * @param {IGame} game - The game object.
 * @param {number} x - The x position of the particle.
 * @param {number} y - The y position of the particle.
 */
export class Fire extends Particle {
  /**
   * Creates a Fire particle effect.
   *
   * @param {IGame} game - The game object.
   * @param {number} x - The x position of the particle.
   * @param {number} y - The y position of the particle.
   */
  constructor(game: IGame, x: number, y: number) {
    super(game);
    this.image = getImage("fire");
    this.size = Math.random() * 100 + 100;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }

  angle: number;
  va: number;
  image: HTMLImageElement;

  /**
   * Updates the Fire particle effect.
   *
   * @remarks
   * - Calls the parent's update method.
   * - Adjusts the particle's angle by its angular velocity.
   * - Modifies the x position based on the sine of the angle to create a wavy motion.
   */
  update() {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle * 10);
  }

  /**
   * Draws the Fire particle effect on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   *
   * @remarks
   * - Saves the current canvas state.
   * - Translates the canvas to the particle's position.
   * - Rotates the canvas by the particle's angle.
   * - Draws the particle's image at the translated and rotated position.
   * - Restores the canvas state.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    ctx.restore();
  }
}
