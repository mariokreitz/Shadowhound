export interface IGame {
  width: number;
  height: number;
  groundMargin: number;
  speed: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;
  update(deltaTime: number): void;
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
  maxFrame: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  states: IStateAction[];
  currentState: IStateAction;
  update(input: string[], deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
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

export interface IStateAction extends IState {
  player: IPlayer;
  enter(): void;
  handleInput(input: string[]): void;
}

export interface ILayer {
  game: IGame;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
  x: number;
  y: number;
  draw(ctx: CanvasRenderingContext2D): void;
  update(): void;
}

export interface IBackground {
  game: IGame;
  width: number;
  height: number;
  layer5Image: HTMLImageElement;
  layer1: ILayer;
  backgroundLayers: ILayer[];
  draw(ctx: CanvasRenderingContext2D): void;
  update(): void;
}

export type CanvasDimensions = {
  width: number;
  height: number;
};

export type CurrentState = {
  state: string;
};

export type BackgroundConstructorParams = {
  game: IGame;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
};
