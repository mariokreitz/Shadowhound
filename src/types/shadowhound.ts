export interface IGame {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  groundMargin: number;
  speed: number;
  lives: number;
  minScore: number;
  maxSpeed: number;
  maxTime: number;
  maxParticles: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;
  UI: IUI;
  menuMusic: ISound;
  menuHoverEffect: ISound;
  menuClickEffect: ISound;
  gameMusic: ISound;
  playerDiesSoon: ISound;
  playerDead: ISound;
  enemies: IEnemy[];
  particles: IParticle[];
  collisions: ICollisionAnimation[];
  floatingMessages: IFloatingMessage[];
  collectables: ICollectable[];
  debug: boolean;
  isGameOver: boolean;
  isGameReset: boolean;
  enemyTimer: number;
  enemyInterval: number;
  score: number;
  time: number;
  lastTime: number;
  fontColor: string;
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D, deltaTime: number): void;
  addEnemy(): void;
  start(): void;
  stop(): void;
  reset(): void;
  animate(timestamp: number): void;
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
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  markedForDeletion: boolean;
  lives: number;
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

export interface IBoss extends IEnemy {
  attackTimer: number;
  attackInterval: number;
  hit: boolean;
}

export interface ICollectable {
  game: IGame;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  markedForDeletion: boolean;
  draw(ctx: CanvasRenderingContext2D): void;
  update(): void;
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
  currentState: IStateAction | null;
  update(input: string[], deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  onGround(): boolean;
  setState(state: number, speed: number): void;
  checkCollisions(): void;
  reset(): void;
}

export interface IInputHandler {
  game: IGame;
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
  draw(ctx: CanvasRenderingContext2D, deltaTime: number): void;
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
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  sound: ISound;
  draw(ctx: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export interface IFloatingMessage {
  value: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  markedForDeletion: boolean;
  timer: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface ISound {
  start(): void;
  stop(): void;
  changeVolume(): void;
  toggleMute(): void;
  audioFile: HTMLAudioElement;
  volumeStates: string[];
  currentVolumeState: string;
}

export type BackgroundConstructorParams = {
  game: IGame;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
};
