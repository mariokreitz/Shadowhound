import { IGame, IPlayer, IInputHandler, CanvasDimensions, IBackground } from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";

export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 80;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;

  constructor({ width, height }: CanvasDimensions) {
    this.width = width;
    this.height = height;
    this.groundMargin = Game.DEFAULT_GROUNDMARGIN;
    this.speed = Game.DEFAULT_SPEED;
    this.maxSpeed = Game.DEFAULT_MAX_SPEED;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler();
  }

  width: number;
  height: number;
  groundMargin: number;
  speed: number;
  maxSpeed: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;

  update(deltaTime: number) {
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
  }
}
