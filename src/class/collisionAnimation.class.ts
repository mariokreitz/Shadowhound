import { ICollisionAnimation, IGame, ISound } from "../types/shadowhound";
import { getImage } from "../utils/misc";
import { Explosion } from "./sounds.class";

export class CollisionAnimation implements ICollisionAnimation {
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
    this.sound = new Explosion();
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
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  maxFrame: number;
  markedForDelection: boolean;
  sound: ISound;

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

  update(deltaTime: number) {
    this.x -= this.game.speed;
    if (this.frameX === 0) this.sound.start();
    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else this.frameTimer += deltaTime;
    if (this.frameX > this.maxFrame) this.markedForDelection = true;
  }
}
