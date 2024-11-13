import { IGame, IPlayer, IInputHandler, CanvasDimensions, IBackground, IEnemy } from "./../types/shadowhound";
import { Background } from "./background.class";
import { InputHandler } from "./input.class";
import { Player } from "./player.class";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.class";

export class Game implements IGame {
  private static readonly DEFAULT_GROUNDMARGIN = 80;
  private static readonly DEFAULT_SPEED = 0;
  private static readonly DEFAULT_MAX_SPEED = 3;
  private static readonly CHANCE_TO_SPAWN_GROUNDENEMY = 0.5;
  enemies: IEnemy[];

  constructor({ width, height }: CanvasDimensions) {
    this.width = width;
    this.height = height;
    this.groundMargin = Game.DEFAULT_GROUNDMARGIN;
    this.speed = Game.DEFAULT_SPEED;
    this.maxSpeed = Game.DEFAULT_MAX_SPEED;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler();
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
  }

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
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < Game.CHANCE_TO_SPAWN_GROUNDENEMY) this.enemies.push(new GroundEnemy(this));
    this.enemies.push(new FlyingEnemy(this));
    console.log(this.enemies);
  }
}
