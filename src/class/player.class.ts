import { IGame, IPlayer } from "../types/shadowhound";
import { showError } from "../utils/misc";
import { Sitting, Running, Jumping, Falling } from "./playerState.class";

export class Player implements IPlayer {
  private static readonly DEFAULT_WEIGHT = 1;
  private static readonly DEFAULT_MAX_SPEED = 10;
  private static readonly DEFAULT_JUMP_FORCE = 27;

  constructor(game: IGame) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.vy = 0;
    this.speed = 0;
    this.image = this.getPlayerImage();
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
    this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
    this.weight = Player.DEFAULT_WEIGHT;
    this.maxSpeed = Player.DEFAULT_MAX_SPEED;
    this.jumpForce = Player.DEFAULT_JUMP_FORCE;
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
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  states: Sitting[];
  currentState: Sitting;

  update(input: string[]): void {
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
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
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

  getPlayerImage(): HTMLImageElement {
    const playerID = "player";
    const playerImage = document.getElementById(playerID) as HTMLImageElement;
    if (!playerImage) {
      showError(playerID);
      return new Image();
    }

    return playerImage;
  }

  onGround(): boolean {
    return this.y >= this.game.height - this.height;
  }

  setState(state: number): void {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
}
