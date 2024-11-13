export interface IGame {
  width: number;
  height: number;
  groundMargin: number;
  speed: number;
  maxSpeed: number;
  enemyTimer: number;
  enemyInterval: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface IAnimations {
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
}
export interface IEnemy extends IAnimations {
  game: IGame;
  height: number;
  width: number;
  x: number;
  y: number;
  image: HTMLImageElement;
  speedX: number;
  speedY: number;
  maxFrame: number;
  markedForDeletion: boolean;
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface IFlyingEnemy extends IEnemy {
  angle: number;
  va: number;
  update(deltaTime: number): void;
}

export interface IPlayer extends IAnimations {
  game: IGame;
  width: number;
  height: number;
  x: number;
  y: number;
  weight: number;
  vy: number;
  image: HTMLImageElement;
  maxFrame: number;
  speed: number;
  maxSpeed: number;
  jumpForce: number;
  states: IStateAction[];
  currentState: IStateAction;
  update(input: string[], deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  onGround(): boolean;
  setState(state: number, speed: number): void;
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
  layer1Image: HTMLImageElement;
  layer2Image: HTMLImageElement;
  layer3Image: HTMLImageElement;
  layer4Image: HTMLImageElement;
  layer5Image: HTMLImageElement;
  layer1: ILayer;
  layer2: ILayer;
  layer3: ILayer;
  layer4: ILayer;
  layer5: ILayer;
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
