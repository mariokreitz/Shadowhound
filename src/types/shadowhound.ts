export interface IGame {
  width: number;
  height: number;
  player: IPlayer;
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
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getPlayerImage(): HTMLImageElement;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};
