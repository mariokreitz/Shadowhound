import { IClimbingEnemy, IEnemy, IFlyingEnemy, IGame } from "../types/shadowhound";
import { getImage } from "../utils/misc";
import { FireBall } from "./particles.class";

class Enemy implements IEnemy {
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
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export class FlyingEnemy extends Enemy implements IFlyingEnemy {
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

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class GroundEnemy extends Enemy {
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

export class ClimbingEnemy extends Enemy implements IClimbingEnemy {
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

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, 0);
    ctx.lineTo(this.x + this.width / 2, this.y + 50);
    ctx.stroke();
  }
}

export class Boss extends FlyingEnemy {
  constructor(game: IGame) {
    super(game);
    this.width = 238;
    this.height = 167;
    this.maxFrame = 7;
    this.image = getImage("enemy-bat-2");
    this.attackTimer = 0;
    this.attackInterval = 1000;
    this.lives = 5;
  }

  attackTimer: number;
  attackInterval: number;
  lives: number;

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.x < this.game.width - this.width - 50) this.x = this.game.width - this.width - 50;
    else this.speedX = 0;
  }

  attack() {
    const playerCenterX = this.game.player.x + this.game.player.width / 2;
    const playerCenterY = this.game.player.y + this.game.player.height / 2;
    const angle = Math.atan2(playerCenterY - (this.y + this.height / 2), this.x + this.width - playerCenterX);
    const fireball = new FireBall(this.game, this.x + this.width / 2, this.y + this.height, -angle);
    this.game.particles.push(fireball);
  }
}
