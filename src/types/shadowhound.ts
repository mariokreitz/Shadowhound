export interface IGame {
  width: number;
  height: number;
}

export interface IPlayer {
  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};
