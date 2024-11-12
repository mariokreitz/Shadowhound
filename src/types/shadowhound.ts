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
  weight: number;
  vy: number;
  image: HTMLImageElement;
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  update(input: string[]): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getPlayerImage(): HTMLImageElement;
  onGround(): boolean;
}

export interface IInputHandler {
  keys: string[];
  addEventListeners(): void;
}

export interface IState {
  state: string;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};

export type CurrentState = {
  state: string;
};
