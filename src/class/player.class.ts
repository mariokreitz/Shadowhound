import { getImage } from "../utils/misc";
import { IEnemy, IGame, IPlayer, IStateAction } from "../types/shadowhound";
import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit, Standing, Dead } from "./playerState.class";
import { CollisionAnimation } from "./collisionAnimation.class";
import { FloatingMessage } from "./floatingMessages.class";
import { Boss } from "./enemies.class";

export class Player implements IPlayer {
  private static readonly DEFAULT_WEIGHT = 1;
  private static readonly DEFAULT_MAX_SPEED = 10;
  private static readonly DEFAULT_JUMP_FORCE = 27;
  private static readonly DEFAULT_FPS = 20;

  constructor(game: IGame) {
    this.fps = Player.DEFAULT_FPS;
    this.jumpForce = Player.DEFAULT_JUMP_FORCE;
    this.weight = Player.DEFAULT_WEIGHT;
    this.maxSpeed = Player.DEFAULT_MAX_SPEED;
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.speed = 0;
    this.image = getImage("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
      new Standing(this.game),
      new Dead(this.game),
    ];
    this.currentState = null;
    this.isDead = false;
    this.playerHit = false;
  }

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
  isDead: boolean;
  playerHit: boolean;

  update(input: string[], deltaTime: number): void {
    this.checkCollisions();
    if (this.currentState) this.currentState.handleInput(input);
    else return;
    //horizontal movement
    this.x += this.speed;
    if (input.includes("ArrowRight") && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
    else if (input.includes("ArrowLeft") && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
    //vertical movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
    // vertical boundaries
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.y = this.game.height - this.height - this.game.groundMargin;
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else {
        this.frameX = 0;
        if (this.isDead) this.game.isGameOver = true;
      }
    } else this.frameTimer += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround(): boolean {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollisions() {
    const isDivingOrRolling = this.currentState === this.states[4] || this.currentState === this.states[5];

    const handleBossCollision = (enemy: Boss, isDivingOrRolling: boolean) => {
      if (isDivingOrRolling) {
        enemy.lives--;
        if (enemy.lives <= 0) {
          markEnemyForDeletion(enemy);
        }
      } else {
        handlePlayerHit();
      }
    };

    const handleRegularEnemyCollision = (enemy: IEnemy, isDivingOrRolling: boolean) => {
      markEnemyForDeletion(enemy);
      if (isDivingOrRolling) {
        this.game.score++;
        this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 100, 50));
      } else {
        handlePlayerHit();
      }
    };

    const markEnemyForDeletion = (enemy: IEnemy) => {
      enemy.markedForDeletion = true;
      this.game.collisions.push(
        new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)
      );
    };

    const handlePlayerHit = () => {
      if (!this.playerHit) {
        this.game.collisions.push(
          new CollisionAnimation(this.game, this.x + this.width * 0.5, this.y + this.height * 0.5)
        );
        this.setState(6, 0);
        this.game.lives--;
        this.playerHit = true;
        setTimeout(() => {
          this.playerHit = false;
        }, 1000);
        if (this.game.lives === 2) this.game.playerDiesSoon.start();
        if (this.game.lives <= 0) {
          this.game.playerDiesSoon.stop();
          this.game.player.setState(8, 0);
          this.game.playerDead.start();
          this.isDead = true;
        }
      }
    };

    this.game.enemies.forEach((enemy) => {
      const isOverlapping =
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y;

      if (isOverlapping) {
        if (enemy instanceof Boss) {
          handleBossCollision(enemy, isDivingOrRolling);
        } else {
          handleRegularEnemyCollision(enemy, isDivingOrRolling);
        }
      }
    });
  }

  reset(): void {
    this.isDead = false;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.speed = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
    this.setState(0, 0);
  }
}
