import { IGame, IParticle } from "../types/shadowhound";
import { getImage } from "../utils/misc";

class Particle implements IParticle {
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

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDelection = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export class Dust extends Particle {
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

export class Splash extends Particle {}

export class Fire extends Particle {
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

  update() {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle * 10);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    ctx.restore();
  }
}
