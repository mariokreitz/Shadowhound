import { IGame, IPlayer } from "../types/shadowhound";
import { showError } from "../utils/misc";

export class Player implements IPlayer {
  private static readonly DEFAULT_WEIGHT = 1;
  private static readonly DEFAULT_MAX_SPEED = 10;
  private static readonly DEFAULT_JUMP_FORCE = 20;

  constructor(game: IGame) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.vy = 0;
    this.weight = Player.DEFAULT_WEIGHT;
    this.image = this.getPlayerImage();
    this.speed = 0;
    this.maxSpeed = Player.DEFAULT_MAX_SPEED;
  }

  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  weight: number;
  vy: number;
  image: HTMLImageElement;
  speed: number;
  maxSpeed: number;

  update(input: string[]): void {
    //horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    //vertical movement
    if (input.includes("ArrowUp") && this.onGround()) this.vy -= Player.DEFAULT_JUMP_FORCE;
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
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
}
