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
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.class";
import { GameEffect1, GameMusic, MenuMusic, MenuHoverEffect, MenuClickEffect } from "./sounds.class";
import { UI } from "./UI.class";

export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 40;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY = 0.5;
  private static readonly DEFAULT_MAX_PARTICLES = 200;
  private static readonly DEFAULT_NEED_SCORE = 40;
  private static readonly DEFAULT_MAX_TIME = 60000;
  private static readonly DEFAULT_LIVES = 5;

  constructor(width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.groundMargin = Game.DEFAULT_GROUNDMARGIN;
    this.speed = Game.DEFAULT_SPEED;
    this.maxSpeed = Game.DEFAULT_MAX_SPEED;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.menuMusic = new MenuMusic();
    this.menuHoverEffect = new MenuHoverEffect();
    this.menuClickEffect = new MenuClickEffect();
    this.gameMusic = new GameMusic();
    this.gameEffect1 = new GameEffect1();
    this.lives = Game.DEFAULT_LIVES;
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.debug = false;
    this.score = 0;
    this.minScore = Game.DEFAULT_NEED_SCORE;
    this.fontColor = "black";
    this.time = 0;
    this.maxTime = Game.DEFAULT_MAX_TIME;
    this.lastTime = 0;
    this.isGameOver = false;
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.maxParticles = Game.DEFAULT_MAX_PARTICLES;
  }

  UI: IUI;
  lives: number;
  debug: boolean;
  score: number;
  minScore: number;
  fontColor: string;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  groundMargin: number;
  speed: number;
  maxSpeed: number;
  enemyTimer: number;
  enemyInterval: number;
  time: number;
  maxTime: number;
  isGameOver: boolean;
  lastTime: number;
  background: IBackground;
  player: IPlayer;
  input: IInputHandler;
  particles: IParticle[];
  maxParticles: number;
  enemies: IEnemy[];
  collisions: ICollisionAnimation[];
  floatingMessages: IFloatingMessage[];
  menuMusic: ISound;
  menuHoverEffect: ISound;
  menuClickEffect: ISound;
  gameMusic: ISound;
  gameEffect1: ISound;

  update(deltaTime: number) {
    this.time += deltaTime;
    // if (this.time > this.maxTime) this.isGameOver = true;
    this.gameEffect1.start();
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    // handle enemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
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

  start() {
    this.animate(0);
    this.menuMusic.stop();
    this.gameMusic.start();
  }

  animate(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
    this.draw(this.ctx, deltaTime);
    if (!this.isGameOver) requestAnimationFrame(this.animate.bind(this));
  }
}
