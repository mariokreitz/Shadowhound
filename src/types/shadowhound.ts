export interface IGame {
  width: number;
  height: number;
  player: IPlayer;
  input: IInputHandler;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface IPlayer {
  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  speed: number;
  maxSpeed: number;
  update(input: string[]): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getPlayerImage(): HTMLImageElement;
}

export interface IInputHandler {
  keys: string[];
  addEventListeners(): void;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};
