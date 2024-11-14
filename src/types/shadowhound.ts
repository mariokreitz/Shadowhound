export interface IGame {
  UI: IUI;
  lives: number;
  debug: boolean;
  score: number;
  minScore: number;
  fontColor: string;
  width: number;
  height: number;
  groundMargin: number;
  speed: number;
  maxSpeed: number;
  enemyTimer: number;
  gameOver: boolean;
  enemyInterval: number;
  time: number;
  maxTime: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;
  particles: IParticle[];
  maxParticles: number;
  enemies: IEnemy[];
  collisions: ICollisionAnimation[];
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

export interface IClimbingEnemy extends IEnemy {
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
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
  game: IGame;
}

export interface IStateAction extends IState {
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

export interface IUI {
  game: IGame;
  fontSize: number;
  fontFamily: string;
  liveImage: HTMLImageElement;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface IParticle {
  game: IGame;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  markedForDelection: boolean;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface ICollisionAnimation extends IAnimations {
  game: IGame;
  image: HTMLImageElement;
  spriteWidth: number;
  spriteHeight: number;
  sizeModifier: number;
  width: number;
  height: number;
  y: number;
  x: number;
  maxFrame: number;
  markedForDelection: boolean;
  draw(ctx: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
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
