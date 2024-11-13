import { IGame, IPlayer, IInputHandler, CanvasDimensions, IBackground } from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";

export class Game implements IGame {
  constructor({ width, height }: CanvasDimensions) {
    this.width = width;
    this.height = height;
    this.groundMargin = 50;
    this.speed = 3;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler();
  }

  width: number;
  height: number;
  groundMargin: number;
  speed: number;
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
