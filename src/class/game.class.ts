import {
  IGame,
  IPlayer,
  IInputHandler,
  IBackground,
  IEnemy,
  IUI,
  IParticle,
  ICollisionAnimation,
  IFloatingMessage,
  ISound,
} from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, Boss } from "./enemies.class";
import { PlayerDiesSoon, GameMusic, MenuMusic, MenuHoverEffect, MenuClickEffect, PlayerDead } from "./sounds.class";
import { UI } from "./UI.class";

export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 40;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY = 0.5;
  private static readonly DEFAULT_MAX_PARTICLES = 200;
  private static readonly DEFAULT_MIN_SCORE = 30;
  private static readonly DEFAULT_MAX_TIME = 60000;
  private static readonly DEFAULT_LIVES = 5;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
    this.groundMargin = Game.DEFAULT_GROUNDMARGIN;
    this.speed = Game.DEFAULT_SPEED;
    this.lives = Game.DEFAULT_LIVES;
    this.minScore = Game.DEFAULT_MIN_SCORE;
    this.maxSpeed = Game.DEFAULT_MAX_SPEED;
    this.maxTime = Game.DEFAULT_MAX_TIME;
    this.maxParticles = Game.DEFAULT_MAX_PARTICLES;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.menuMusic = new MenuMusic();
    this.menuHoverEffect = new MenuHoverEffect();
    this.menuClickEffect = new MenuClickEffect();
    this.gameMusic = new GameMusic();
    this.playerDiesSoon = new PlayerDiesSoon();
    this.playerDead = new PlayerDead();
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.debug = false;
    this.isGameOver = false;
    this.isGameReset = false;
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.score = 0;
    this.time = 0;
    this.lastTime = 0;
    this.fontColor = "black";
    this.player.currentState = this.player.states[7];
    this.player.currentState.enter();
  }

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
  debug: boolean;
  isGameOver: boolean;
  isGameReset: boolean;
  enemyTimer: number;
  enemyInterval: number;
  score: number;
  time: number;
  lastTime: number;
  fontColor: string;

  update(deltaTime: number) {
    this.time += deltaTime;
    // if (this.time > this.maxTime) this.isGameOver = true;
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    //handle enemies
    if (this.score < this.minScore && this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else if (this.score >= this.minScore && this.enemyTimer > this.enemyInterval) {
      this.addBoss();
      this.enemyTimer = 0;
      const boss = this.enemies.find((enemy) => enemy instanceof Boss) as Boss;
      if (boss) boss.attack();
    } else this.enemyTimer += deltaTime;

    this.enemies.forEach((enemy) => enemy.update(deltaTime));
    // handle messages
    this.floatingMessages.forEach((message) => message.update());
    // handle particles
    this.particles.forEach((particle) => particle.update());
    if (this.particles.length > this.maxParticles) this.particles = this.particles.slice(0, this.maxParticles);
    // handle collision sprites
    this.collisions.forEach((collision) => collision.update(deltaTime));
    // handle filter for arrays
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDelection);
    this.collisions = this.collisions.filter((collision) => !collision.markedForDelection);
    this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);
  }

  draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.particles.forEach((particle) => particle.draw(ctx));
    this.collisions.forEach((collision) => collision.draw(ctx));
    this.floatingMessages.forEach((message) => message.draw(ctx));
    this.UI.draw(ctx, deltaTime);
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_GROUNDENEMY) this.enemies.push(new GroundEnemy(this));
    else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
    this.enemies.push(new FlyingEnemy(this));
  }

  addBoss() {
    if (!this.enemies.some((enemy) => enemy instanceof Boss)) {
      this.enemies.push(new Boss(this));
    }
  }

  start() {
    this.isGameReset = false;
    this.animate(0);
    this.menuMusic.stop();
    this.gameMusic.start();
  }

  stop() {
    this.gameMusic.stop();
    this.menuMusic.start();
  }

  reset() {
    this.lives = Game.DEFAULT_LIVES;
    this.score = 0;
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.player.reset();
    this.isGameReset = true;
    this.canvas.style.border = "none";
  }

  animate(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
    this.draw(this.ctx, deltaTime);
    if (!this.isGameOver && !this.isGameReset) requestAnimationFrame(this.animate.bind(this));
  }
}
