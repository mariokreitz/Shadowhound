import { getImage } from "../utils/misc";
import { IEnemy, IGame, IPlayer, IStateAction } from "../types/shadowhound";
import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit, Standing, Dead } from "./playerState.class";
import { CollisionAnimation } from "./collisionAnimation.class";
import { FloatingMessage } from "./floatingMessages.class";
import { Boss } from "./enemies.class";
import { FireBall } from "./particles.class";
import { DogHead, Heart } from "./collectables.class";

/**
 * The Player class implements the IPlayer interface and provides a service for the game character.
 *
 * @class
 * @implements {IPlayer}
 */
export class Player implements IPlayer {
  /**
   * The default weight of the player.
   * @constant {number}
   */
  private static readonly DEFAULT_WEIGHT = 1;

  /**
   * The default maximum speed of the player.
   * @constant {number}
   */
  private static readonly DEFAULT_MAX_SPEED = 10;

  /**
   * The default jump force of the player.
   * @constant {number}
   */
  private static readonly DEFAULT_JUMP_FORCE = 27;

  /**
   * The default frames per second of the player.
   * @constant {number}
   */
  private static readonly DEFAULT_FPS = 20;

  /**
   * The default cooldown interval in milliseconds.
   * @constant {number}
   */
  private static readonly DEFAULT_COOLDOWN_INTERVAL = 2000;

  /**
   * Initializes a new instance of the Player class.
   * @param {IGame} game The game object.
   */
  constructor(game: IGame) {
    this.fps = Player.DEFAULT_FPS;
    this.jumpForce = Player.DEFAULT_JUMP_FORCE;
    this.weight = Player.DEFAULT_WEIGHT;
    this.maxSpeed = Player.DEFAULT_MAX_SPEED;
    this.rollingCooldownInterval = Player.DEFAULT_COOLDOWN_INTERVAL;
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
    this.rollingCooldown = 0;
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
  rollingCooldown: number;
  rollingCooldownInterval: number;

  /**
   * Updates the player.
   *
   * @param {string[]} input - The current input.
   * @param {number} deltaTime - The delta time.
   */
  update(input: string[], deltaTime: number): void {
    this.checkCollisions();

    if (this.currentState) this.currentState.handleInput(input);
    else return;
    if (this.currentState === this.states[7]) return;
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
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
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

  /**
   * Draws the player on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
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

  /**
   * Checks if the player is on the ground.
   * @returns {boolean} True if the player is on the ground, false otherwise.
   */
  onGround(): boolean {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  /**
   * Sets the current state of the player to the given state.
   * @param {number} state - The index of the state in the states array.
   * @param {number} speed - The speed multiplier to set the game speed to.
   */
  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  /**
   * Checks for collisions between the player and enemies or particles.
   *
   * Determines if the player is in a "diving" or "rolling" state and handles
   * collisions accordingly. For bosses, reduces their lives, creates collision
   * animations, and marks them for deletion if their lives reach zero. For regular
   * enemies, increments the score and displays a floating message if the player
   * is in the correct state; otherwise, handles player hit. Handles player hit
   * when colliding with a FireBall particle.
   *
   * Updates game states such as game over, player lives, and collision animations.
   */
  checkCollisions() {
    const isDivingOrRolling = this.currentState === this.states[4] || this.currentState === this.states[5];

    /**
     * Handles the collision between the player and a boss enemy.
     *
     * @param {Boss} enemy - The boss enemy involved in the collision.
     * @param {boolean} isDivingOrRolling - Indicates if the player is in a "diving" or "rolling" state.
     *
     * If the player is diving or rolling and the boss has not yet been hit, reduces the boss's lives,
     * creates a collision animation, and temporarily marks the boss as hit to prevent consecutive hits.
     * If the boss's lives reach zero, marks the boss for deletion and sets the game over state.
     * If the player is not diving or rolling, handles player being hit.
     */
    const handleBossCollision = (enemy: Boss, isDivingOrRolling: boolean) => {
      if (isDivingOrRolling) {
        if (!enemy.hit) {
          enemy.lives--;
          this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
          this.game.collisionSound.start();
          enemy.hit = true;
          setTimeout(() => {
            enemy.hit = false;
          }, 1000);
        }
        if (enemy.lives <= 0) {
          markEnemyForDeletion(enemy);
          this.game.isGameOver = true;
        }
      } else {
        handlePlayerHit();
      }
    };

    /**
     * Handles the collision between the player and a regular enemy.
     *
     * @param {IEnemy} enemy - The regular enemy involved in the collision.
     * @param {boolean} isDivingOrRolling - Indicates if the player is in a "diving" or "rolling" state.
     *
     * Marks the enemy for deletion and increments the score if the player is diving or rolling.
     * Handles player being hit if the player is not diving or rolling.
     */
    const handleRegularEnemyCollision = (enemy: IEnemy, isDivingOrRolling: boolean) => {
      markEnemyForDeletion(enemy);
      if (isDivingOrRolling) {
        this.game.collisionSound.start();
      } else {
        handlePlayerHit();
      }
    };

    /**
     * Marks an enemy for deletion and adds a collision animation to the game.
     *
     * @param {IEnemy} enemy - The enemy to be marked for deletion.
     */
    const markEnemyForDeletion = (enemy: IEnemy) => {
      enemy.markedForDeletion = true;
      this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
    };

    /**
     * Handles the player being hit by an enemy or particle.
     *
     * Marks the player as hit, reduces the player's lives, and sets the game over
     * state if the player's lives reach zero. If the player's lives reach two, starts
     * the "playerDiesSoon" sound effect. If the player is already hit, does nothing.
     */
    const handlePlayerHit = () => {
      if (!this.playerHit) {
        this.setState(6, 0);
        this.game.collisionSound.start();
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

    this.game.collectables.forEach((item) => {
      const isOverlapping =
        item.x < this.x + this.width && item.x + item.width > this.x && item.y < this.y + this.height && item.y + item.height > this.y;

      if (isOverlapping) {
        if (item instanceof DogHead) {
          this.game.scoreUp.start();
          item.markedForDeletion = true;
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessage("+1", item.x, item.y, 100, 80));
        } else if (item instanceof Heart) {
          this.game.playerHeal.start();
          item.markedForDeletion = true;
          this.game.lives++;
        }
      }
    });

    this.game.particles.forEach((particle) => {
      if (particle instanceof FireBall) {
        const isOverlapping =
          particle.x < this.x + this.width &&
          particle.x + particle.size > this.x &&
          particle.y < this.y + this.height &&
          particle.y + particle.size > this.y;

        if (isOverlapping) {
          handlePlayerHit();
          particle.markedForDelection = true;
        }
      }
    });
  }

  /**
   * Resets the player to its initial state.
   * Resets the player's lives, x and y position, vertical and horizontal speed, frameX and frameY, and maxFrame.
   * Also sets the player's state to 0 (sitting) and resets the isDead flag to false.
   */
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
