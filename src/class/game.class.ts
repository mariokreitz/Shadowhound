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
  ICollectable,
} from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";
import { DogHead, Heart } from "./collectables.class";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, Boss } from "./enemies.class";
import {
  PlayerDiesSoon,
  GameMusic,
  MenuMusic,
  MenuHoverEffect,
  MenuClickEffect,
  PlayerDead,
  Explosion,
  Heal,
  ScoreUp,
} from "./sounds.class";
import { UI } from "./UI.class";

/**
 * The main game class.
 *
 * @class Game
 * @implements {IGame}
 */
export class Game implements IGame {
  /**
   * The default ground margin.
   * @constant
   * @type {number}
   * @default 40
   */
  private static readonly DEFAULT_GROUNDMARGIN: number = 40;

  /**
   * The default speed.
   * @constant
   * @type {number}
   * @default 0
   */
  private static readonly DEFAULT_SPEED: number = 0;

  /**
   * The default maximum speed.
   * @constant
   * @type {number}
   * @default 3
   */
  private static readonly DEFAULT_MAX_SPEED: number = 3;

  /**
   * The chance to spawn a ground enemy.
   * @constant
   * @type {number}
   * @default 0.5
   */
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY: number = 0.5; //this is 50%

  /**
   * The chance to spawn a collectable.
   * @constant
   * @type {number}
   * @default 0.5
   */
  private static readonly CHANCE_TO_SPAWN_COLLECTABLE: number = 0.5; // this is 50%

  /**
   * The default maximum number of particles.
   * @constant
   * @type {number}
   * @default 200
   */
  private static readonly DEFAULT_MAX_PARTICLES: number = 200;

  /**
   * The default minimum score.
   * @constant
   * @type {number}
   * @default 10
   */
  private static readonly DEFAULT_MIN_SCORE: number = 10;

  /**
   * The default maximum time.
   * @constant
   * @type {number}
   * @default 60000
   */
  private static readonly DEFAULT_MAX_TIME: number = 60000;

  /**
   * The default number of lives.
   * @constant
   * @type {number}
   * @default 5
   */
  private static readonly DEFAULT_LIVES: number = 5;

  /**
   * The constructor for the Game class.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
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
    this.collisionSound = new Explosion();
    this.playerDead = new PlayerDead();
    this.playerHeal = new Heal();
    this.scoreUp = new ScoreUp();
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.collectables = [];
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
    this.player.currentState = this.player.states[0];
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
  collisionSound: ISound;
  scoreUp: ISound;
  playerHeal: ISound;
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

  /**
   * Updates the game state.
   *
   * @param {number} deltaTime - The time elapsed since the last update.
   *
   * This function updates various game elements based on the elapsed time.
   * It increments the game time and updates the background, collectables, player,
   * enemies, particles, collision sprites, and floating messages. It handles
   * spawning collectables, adding enemies or bosses based on the score, and
   * managing enemy attacks. It also limits the number of particles, filters out
   * marked-for-deletion entities, and provides debugging output if enabled.
   */
  update(deltaTime: number) {
    this.time += deltaTime;
    this.background.update();
    // handle collectables
    if (this.enemyTimer > this.enemyInterval && !this.enemies.find((enemy) => enemy instanceof Boss)) this.addCollectable();
    this.collectables.forEach((item) => item.update());
    // handle player update
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

    // handle particles
    this.particles.forEach((particle) => particle.update());
    if (this.particles.length > this.maxParticles) this.particles = this.particles.slice(0, this.maxParticles);
    // handle collision sprites
    this.collisions.forEach((collision) => collision.update(deltaTime));
    // handle floating messages
    this.floatingMessages.forEach((message) => message.update());
    // handle filter for arrays
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDelection);
    this.collisions = this.collisions.filter((collision) => !collision.markedForDelection);
    this.floatingMessages = this.floatingMessages.filter((message) => !message.markedForDeletion);
    this.collectables = this.collectables.filter((item) => !item.markedForDeletion);

    // array debugging
    if (this.debug) this.debugArrays();
  }

  /**
   * Logs the game objects to the console for debugging purposes.
   * This will log the current state of the game objects to the console.
   * The logged objects include enemies, particles, collision sprites, floating messages, and collectables.
   */
  debugArrays() {
    console.groupCollapsed("Game Debug");
    console.groupCollapsed("Enemies");
    console.table(this.enemies, ["x", "y", "speedX", "speedY", "markedForDeletion"]);
    console.groupEnd();
    console.groupCollapsed("Particles");
    console.table(this.particles, ["x", "y", "speedX", "speedY", "markedForDelection"]);
    console.groupEnd();
    console.groupCollapsed("Collision Sprites");
    console.table(this.collisions, ["x", "y", "frameX", "frameY", "markedForDelection"]);
    console.groupEnd();
    console.groupCollapsed("Floating Messages");
    console.table(this.floatingMessages, ["x", "y", "text", "markedForDeletion"]);
    console.groupEnd();
    console.groupCollapsed("Collectables");
    console.table(this.collectables, ["x", "y", "width", "height", "markedForDeletion"]);
    console.groupEnd();
    console.groupEnd();
  }

  /**
   * Draws the game elements.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} deltaTime - The delta time.
   */
  draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.collectables.forEach((item) => item.draw(ctx));
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.particles.forEach((particle) => particle.draw(ctx));
    this.collisions.forEach((collision) => collision.draw(ctx));
    this.floatingMessages.forEach((message) => message.draw(ctx));
    this.UI.draw(ctx, deltaTime);
  }

  /**
   * Adds an enemy to the game.
   * The type of enemy is randomly selected, but is influenced by the current speed of the game.
   * If the speed is greater than 0 and a random number is less than Game.CHANCE_TO_SPAWN_GROUNDENEMY, a GroundEnemy is spawned.
   * If the speed is greater than 0 and the random number is not less than Game.CHANCE_TO_SPAWN_GROUNDENEMY, a ClimbingEnemy is spawned.
   * Otherwise, a FlyingEnemy is spawned.
   */
  addEnemy() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_GROUNDENEMY) this.enemies.push(new GroundEnemy(this));
    else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
    this.enemies.push(new FlyingEnemy(this));
  }

  /**
   * Adds a Boss enemy to the game if one does not already exist.
   * It checks the current enemies and only adds a Boss if none are present.
   */
  addBoss() {
    if (!this.enemies.some((enemy) => enemy instanceof Boss)) this.enemies.push(new Boss(this));
  }

  /**
   * Adds a collectable item to the game if the speed is greater than 0 and a random number is less than Game.CHANCE_TO_SPAWN_COLLECTABLE.
   * The type of collectable item is randomly selected, but is influenced by the current speed of the game.
   * If the speed is greater than 0 and a random number is less than Game.CHANCE_TO_SPAWN_COLLECTABLE, a DogHead is spawned.
   */
  addCollectable() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_COLLECTABLE) this.collectables.push(new DogHead(this));
    if (this.lives < 3 && !this.collectables.some((item) => item instanceof Heart)) this.collectables.push(new Heart(this));
  }

  /**
   * Starts the game.
   * Sets isGameReset to false, calls animate() with 0 as the argument, stops the menuMusic, and starts the gameMusic.
   */
  start() {
    this.isGameReset = false;
    this.animate(0);
    this.menuMusic.stop();
    this.gameMusic.start();
  }

  /**
   * Stops the game.
   * Stops the gameMusic and starts the menuMusic.
   */
  stop() {
    this.gameMusic.stop();
    this.menuMusic.start();
  }

  /**
   * Resets the game to its initial state.
   * Resets the game's lives, score, enemies, particles, collisions, floating messages, and the player.
   * Also sets isGameReset to true and removes the red border from the game canvas.
   */
  reset() {
    this.lives = Game.DEFAULT_LIVES;
    this.score = 0;
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.collectables = [];
    this.floatingMessages = [];
    this.player.reset();
    this.isGameReset = true;
    this.canvas.style.border = "none";
  }

  /**
   * Animates the game frame.
   *
   * @param {number} timestamp - The current timestamp provided by requestAnimationFrame.
   * Calculates the time difference from the last frame, updates game elements, clears the canvas, and draws all game components.
   * If the game is not over or reset, it requests the next animation frame.
   */
  animate(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
    this.draw(this.ctx, deltaTime);
    if (!this.isGameOver && !this.isGameReset) requestAnimationFrame(this.animate.bind(this));
  }
}
