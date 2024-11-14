import { IGame, IParticle } from "../types/shadowhound";

class Particle implements IParticle {
  constructor(game: IGame) {
    this.game = game;
    this.markedForDelection = false;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.size = 0;
  }

  game: IGame;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  markedForDelection: boolean;

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDelection = true;
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
    this.color = "black";
  }

  color: string;

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export class Splash extends Particle {}

export class Fire extends Particle {}
