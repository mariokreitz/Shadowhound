import { getImage } from "../utils/misc";
import { IGame, IPlayer, IStateAction } from "../types/shadowhound";
import { Sitting, Running, Jumping, Falling } from "./playerState.class";

export class Player implements IPlayer {
  private static readonly DEFAULT_WEIGHT = 1;
  private static readonly DEFAULT_MAX_SPEED = 10;
  private static readonly DEFAULT_JUMP_FORCE = 27;
  private static readonly DEFAULT_FPS = 20;

  constructor(game: IGame) {
    this.fps = Player.DEFAULT_FPS;
    this.jumpForce = Player.DEFAULT_JUMP_FORCE;
    this.weight = Player.DEFAULT_WEIGHT;
    this.maxSpeed = Player.DEFAULT_MAX_SPEED;
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.speed = 0;
    this.image = getImage("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }

  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  weight: number;
  vy: number;
  image: HTMLImageElement;
  frameX: number;
  frameY: number;
  maxFrame: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  states: IStateAction[];
  currentState: IStateAction;

  update(input: string[], deltaTime: number): void {
    this.currentState.handleInput(input);
    //horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    //vertical movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.frameTimer += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround(): boolean {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
}
