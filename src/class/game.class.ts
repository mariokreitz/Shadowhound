import { IGame, IPlayer, IInputHandler, CanvasDimensions } from "./../types/shadowhound";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";

export class Game implements IGame {
  constructor({ width, height }: CanvasDimensions) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
    this.input = new InputHandler();
  }

  width: number;
  height: number;
  player: IPlayer;
  input: IInputHandler;

  update(deltaTime: number) {
    this.player.update(this.input.keys, deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.player.draw(ctx);
  }
}
