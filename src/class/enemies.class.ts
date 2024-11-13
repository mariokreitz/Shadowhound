import { IEnemy, IFlyingEnemy, IGame } from "../types/shadowhound";
import { getImage } from "../utils/misc";

class Enemy implements IEnemy {
  constructor(game: IGame) {
    this.game = game;
    this.width = 0;
    this.heigh = 0;
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
  }
  game: IGame;
  heigh: number;
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

  update(deltaTime: number): void {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.frameTimer += deltaTime;

    // check if off screen
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.heigh,
      this.x,
      this.y,
      this.width,
      this.heigh
    );
  }
}

export class FlyingEnemy extends Enemy implements IFlyingEnemy {
  constructor(game: IGame) {
    super(game);
    this.width = 60;
    this.heigh = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = getImage("enemy_fly");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }

  angle: number;
  va: number;

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {}

export class ClimbingEnemy extends Enemy {}
