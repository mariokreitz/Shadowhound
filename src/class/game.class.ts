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

/**
 * Game class for the game.
 *
 * @class Game
 * @implements {IGame}
 * @property {HTMLCanvasElement} canvas - The canvas element.
 * @property {number} width - The width of the canvas.
 * @property {number} height - The height of the canvas.
 * @property {CanvasRenderingContext2D} ctx - The canvas context.
 * @property {number} groundMargin - The ground margin.
 * @property {number} speed - The speed of the game.
 * @property {number} lives - The lives of the player.
 * @property {number} minScore - The minimum score to spawn a boss.
 * @property {number} maxSpeed - The maximum speed of the game.
 * @property {number} maxTime - The maximum time of the game.
 * @property {number} maxParticles - The maximum number of particles.
 * @property {IBackground} background - The background object.
 * @property {IPlayer} player - The player object.
 * @property {IInputHandler} input - The input handler object.
 * @property {IUI} UI - The UI object.
 * @property {ISound} menuMusic - The menu music object.
 * @property {ISound} menuHoverEffect - The menu hover effect object.
 * @property {ISound} menuClickEffect - The menu click effect object.
 * @property {ISound} gameMusic - The game music object.
 * @property {ISound} playerDiesSoon - The player dies soon sound object.
 * @property {ISound} playerDead - The player dead sound object.
 * @property {IEnemy[]} enemies - The enemies array.
 * @property {IParticle[]} particles - The particles array.
 * @property {ICollisionAnimation[]} collisions - The collisions array.
 * @property {IFloatingMessage[]} floatingMessages - The floating messages array.
 * @property {boolean} debug - The debug flag.
 * @property {boolean} isGameOver - The game over flag.
 * @property {boolean} isGameReset - The game reset flag.
 * @property {number} enemyTimer - The enemy timer.
 * @property {number} enemyInterval - The enemy interval.
 * @property {number} score - The score of the player.
 * @property {number} time - The time of the game.
 * @property {number} lastTime - The last time of the game.
 * @property {string} fontColor - The font color.
 */
export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 40;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY = 0.5;
  private static readonly DEFAULT_MAX_PARTICLES = 200;
  private static readonly DEFAULT_MIN_SCORE = 30;
  private static readonly DEFAULT_MAX_TIME = 60000;
  private static readonly DEFAULT_LIVES = 5;

  /**
   * Constructor for the Game class.
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

  /**
   * Updates the game.
   *
   * @param {number} deltaTime - The delta time.
   */
  update(deltaTime: number) {
    this.time += deltaTime;
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

  /**
   * Draws the game elements.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} deltaTime - The delta time.
   */
  draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.particles.forEach((particle) => particle.draw(ctx));
    this.collisions.forEach((collision) => collision.draw(ctx));
    this.UI.draw(ctx, deltaTime);
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_GROUNDENEMY) this.enemies.push(new GroundEnemy(this));
    /**
     * Adds an enemy to the game.
     * The type of enemy is randomly selected, but is influenced by the current speed of the game.
     * If the speed is greater than 0 and a random number is less than Game.CHANCE_TO_SPAWN_GROUNDENEMY, a GroundEnemy is spawned.
     * If the speed is greater than 0 and the random number is not less than Game.CHANCE_TO_SPAWN_GROUNDENEMY, a ClimbingEnemy is spawned.
     * Otherwise, a FlyingEnemy is spawned.
     */ else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
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
