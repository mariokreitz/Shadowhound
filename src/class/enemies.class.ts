import { IEnemy, IGame, IFlyingEnemy, IClimbingEnemy, IBoss } from "../types/shadowhound";
import { getImage } from "../utils/misc";
import { FireBall } from "./particles.class";

/**
 * @class Enemy
 * @implements {IEnemy}
 * @property {IGame} game - The game object.
 * @property {number} width - The width of the enemy.
 * @property {number} height - The height of the enemy.
 * @property {number} x - The x position of the enemy.
 * @property {number} y - The y position of the enemy.
 * @property {HTMLImageElement} image - The image element for the enemy.
 * @property {number} speedX - The x speed of the enemy.
 * @property {number} speedY - The y speed of the enemy.
 * @property {number} maxFrame - The maximum frame of the enemy.
 * @property {number} frameX - The x position of the frame of the enemy.
 * @property {number} frameY - The y position of the frame of the enemy.
 * @property {number} fps - The frames per second of the enemy.
 * @property {number} frameInterval - The frame interval of the enemy in milliseconds.
 * @property {number} frameTimer - The frame timer of the enemy.
 * @property {boolean} markedForDeletion - The flag to check if the enemy is marked for deletion.
 * @property {number} lives - The lives of the enemy.
 */
class Enemy implements IEnemy {
  /**
   * @constructor
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    this.game = game;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
    this.lives = 1;
  }
  game: IGame;
  height: number;
  width: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  speedX: number;
  speedY: number;
  maxFrame: number;
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  markedForDeletion: boolean;
  lives: number;

  /**
   * Updates the enemy.
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number): void {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    this.frameTimer += deltaTime;

    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }

    if (this.x + this.width < 0) {
      this.markedForDeletion = true;
    }
  }

  /**
   * Draws the enemy.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

/**
 * @class FlyingEnemy
 * @extends {Enemy}
 * @implements {IFlyingEnemy}
 * @property {number} angle - The angle of the enemy.
 * @property {number} va - The vertical angle of the enemy.
 */
export class FlyingEnemy extends Enemy implements IFlyingEnemy {
  /**
   * @constructor
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = getImage("enemy-fly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }
  angle: number;
  va: number;

  /**
   * Updates the enemy.
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

/**
 * @class GroundEnemy
 * @extends {Enemy}
 * @property {number} angle - The angle of the enemy.
 * @property {number} va - The vertical angle of the enemy.
 */
export class GroundEnemy extends Enemy {
  /**
   * @constructor
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = getImage("enemy-plant");
    this.maxFrame = 1;
  }
}

/**
 * @class ClimbingEnemy
 * @extends {Enemy}
 * @implements {IClimbingEnemy}
 * @property {number} angle - The angle of the enemy.
 * @property {number} va - The vertical angle of the enemy.
 */
export class ClimbingEnemy extends Enemy implements IClimbingEnemy {
  /**
   * @constructor
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.image = getImage("enemy-spider-big");
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
  }

  /**
   * Updates the enemy.
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }

  /**
   * Draws the enemy.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, 0);
    ctx.lineTo(this.x + this.width / 2, this.y + 50);
    ctx.stroke();
  }
}

/**
 * @class Boss
 * @extends {FlyingEnemy}
 * @property {number} attackTimer - The timer for the boss's attack.
 * @property {number} attackInterval - The interval for the boss's attack in milliseconds.
 * @property {number} lives - The lives of the boss.
 * @property {boolean} hit - The flag to check if the boss is hit.
 */
export class Boss extends FlyingEnemy implements IBoss {
  /**
   * @constructor
   * @param {IGame} game - The game object.
   */
  constructor(game: IGame) {
    super(game);
    this.width = 238;
    this.height = 167;
    this.maxFrame = 7;
    this.image = getImage("enemy-bat-2");
    this.attackTimer = 0;
    this.attackInterval = 1000;
    this.lives = 5;
    this.hit = false;
  }

  attackTimer: number;
  attackInterval: number;
  hit: boolean;

  /**
   * Updates the enemy.
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.x < this.game.width - this.width - 50) this.x = this.game.width - this.width - 50;
    else this.speedX = 0;
  }

  /**
   * Attacks the player.
   */
  attack() {
    const playerCenterX = this.game.player.x + this.game.player.width / 2;
    const playerCenterY = this.game.player.y + this.game.player.height / 2;
    const angle = Math.atan2(playerCenterY - (this.y + this.height / 2), this.x + this.width - playerCenterX);
    const fireball = new FireBall(this.game, this.x + this.width / 2, this.y + this.height, -angle);
    this.game.particles.push(fireball);
  }
}
