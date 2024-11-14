import {
  IGame,
  IPlayer,
  IInputHandler,
  CanvasDimensions,
  IBackground,
  IEnemy,
  IUI,
  IParticle,
} from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.class";
import { UI } from "./UI.class";

export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 80;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY = 0.5;
  private static readonly DEFAULT_MAX_PARTICLES = 200;

  constructor({ width, height }: CanvasDimensions) {
    this.width = width;
    this.height = height;
    this.groundMargin = Game.DEFAULT_GROUNDMARGIN;
    this.speed = Game.DEFAULT_SPEED;
    this.maxSpeed = Game.DEFAULT_MAX_SPEED;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.enemies = [];
    this.particles = [];
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.debug = true;
    this.score = 0;
    this.fontColor = "black";
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.maxParticles = Game.DEFAULT_MAX_PARTICLES;
  }

  UI: IUI;
  debug: boolean;
  score: number;
  fontColor: string;
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
  particles: IParticle[];
  maxParticles: number;
  enemies: IEnemy[];

  update(deltaTime: number) {
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    // handle enemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else this.enemyTimer += deltaTime;

    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion) this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    });
    // handle particles
    this.particles.forEach((particle) => {
      particle.update();
      if (particle.markedForDelection)
        this.particles = this.particles.filter((particle) => !particle.markedForDelection);
    });
    if (this.particles.length > this.maxParticles) this.particles = this.particles.slice(0, this.maxParticles);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.particles.forEach((particle) => particle.draw(ctx));
    this.UI.draw(ctx);
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_GROUNDENEMY) this.enemies.push(new GroundEnemy(this));
    else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
    this.enemies.push(new FlyingEnemy(this));
  }
}
