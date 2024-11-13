import { IEnemy } from "../types/shadowhound";

class Enemy implements IEnemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;

  update(deltaTime: number): void {}
  draw(ctx: CanvasRenderingContext2D): void {}
}

class FlyingEnemy extends Enemy {}

class GroundEnemy extends Enemy {}

class ClimbingEnemy extends Enemy {}
