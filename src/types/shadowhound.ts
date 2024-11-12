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
  frameX: number;
  frameY: number;
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  states: ISitting[];
  currentState: ISitting;
  update(input: string[]): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getPlayerImage(): HTMLImageElement;
  onGround(): boolean;
  setState(state: number): void;
}

export interface IInputHandler {
  keys: string[];
  addEventListeners(): void;
}

export interface IState {
  state: string;
}

export interface ISitting extends IState {
  player: IPlayer;
  enter(): void;
  handleInput(input: any): void;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};

export type CurrentState = {
  state: string;
};
