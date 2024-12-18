import { IStateAction, IState, IGame } from "../types/shadowhound";
import { Dust, Fire, Splash } from "./particles.class";

/**
 * Enum that holds all states of the player.
 * @enum {number}
 * @readonly
 * @property {number} SITTING - The player is sitting.
 * @property {number} RUNNING - The player is running.
 * @property {number} JUMPING - The player is jumping.
 * @property {number} FALLING - The player is falling.
 * @property {number} ROLLING - The player is rolling.
 * @property {number} DIVING - The player is diving.
 * @property {number} HIT - The player is hit.
 * @property {number} STANDING - The player is standing.
 * @property {number} DEAD - The player is dead.
 */
enum states {
  SITTING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
  ROLLING = 4,
  DIVING = 5,
  HIT = 6,
  STANDING = 7,
  DEAD = 8,
}

/**
 * Abstract class that represents a state of the player.
 *
 * @class State
 * @implements {IState}
 * @abstract
 * @property {string} state - The name of the state.
 * @property {IGame} game - The game instance.
 */
class State implements IState {
  /**
   * Creates an instance of a State.
   * @param {string} state - The name of the state.
   * @param {IGame} game - The game instance.
   */
  constructor(state: string, game: IGame) {
    this.state = state;
    this.game = game;
  }
  state: string;
  game: IGame;
}

/**
 * Abstract class that represents a state of the player.
 *
 * @class State
 * @implements {IState}
 * @abstract
 * @property {string} state - The name of the state.
 * @property {IGame} game - The game instance.
 */
export class Sitting extends State implements IStateAction {
  /**
   * Creates an instance of the Sitting state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("SITTING", game);
  }

  /**
   * Enter the Sitting state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 4;
    this.game.player.frameY = 5;
  }

  /**
   * Handle input for the Sitting state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) this.game.player.setState(states.RUNNING, 1);

    if (this.game.player.onCooldown) return;
    if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

/**
 * Represents the player sitting state.
 * @class Sitting
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Running extends State implements IStateAction {
  /**
   * Creates an instance of the Running state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("RUNNING", game);
  }

  /**
   * Enter the Running state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 8;
    this.game.player.frameY = 3;
  }

  /**
   * Handle input for the Running state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    this.game.particles.unshift(
      new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height)
    );

    if (input.includes("ArrowDown")) this.game.player.setState(states.SITTING, 0);
    else if (input.includes("ArrowUp")) this.game.player.setState(states.JUMPING, 1);

    if (this.game.player.onCooldown) return;
    if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

/**
 * State for when the player is running.
 * @class Jumping
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Jumping extends State implements IStateAction {
  /**
   * Creates an instance of the Jumping state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("JUMPING", game);
  }

  /**
   * Enter the Jumping state.
   */
  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= this.game.player.jumpForce;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 1;
  }

  /**
   * Handle input for the Jumping state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    if (this.game.player.vy > this.game.player.weight) this.game.player.setState(states.FALLING, 1);
    else if (input.includes("ArrowDown")) this.game.player.setState(states.DIVING, 0);

    if (this.game.player.onCooldown) return;
    if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

/**
 * State for when the player is falling.
 * @class Falling
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Falling extends State implements IStateAction {
  /**
   * Creates an instance of the Falling state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("FALLING", game);
  }

  /**
   * Enter the Falling state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 2;
  }

  /**
   * Handle input for the Falling state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    if (this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
    else if (input.includes("ArrowDown")) this.game.player.setState(states.DIVING, 0);
  }
}

/**
 * Represents the player rolling state.
 * @class Rolling
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Rolling extends State implements IStateAction {
  /**
   * Creates an instance of the Rolling state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("ROLLING", game);
  }

  /**
   * Enter the Rolling state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 6;
  }

  /**
   * Handle input for the Rolling state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    this.game.particles.unshift(
      new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5)
    );
    this.game.player.rollingCooldown += 1;
    if (this.game.player.rollingCooldown > this.game.player.rollingCooldownInterval) {
      this.game.player.setState(states.RUNNING, 1);
      this.game.player.onCooldown = true;
    }

    if (!input.includes("Enter") && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
    else if (!input.includes("Enter") && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 1);
    else if (input.includes("Enter") && input.includes("ArrowUp") && this.game.player.onGround())
      this.game.player.setState(states.JUMPING, 1);
    else if (input.includes("ArrowDown") && !this.game.player.onGround()) this.game.player.setState(states.DIVING, 0);
  }
}

/**
 * The Rolling state class, representing the player in a rolling state.
 *
 * @class Rolling
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Diving extends State implements IStateAction {
  /**
   * Creates an instance of the Diving state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("DIVING", game);
  }

  /**
   * Enter the Diving state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 6;
    this.game.player.vy = 15;
  }

  /**
   * Handle input for the Diving state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    this.game.particles.unshift(
      new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5)
    );
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height)
        );
      }
    } else if (input.includes("Enter") && this.game.player.onGround()) this.game.player.setState(states.ROLLING, 2);
  }
}

/**
 * The Diving state class, representing the player in a diving state.
 *
 * @class Diving
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Hit extends State implements IStateAction {
  /**
   * Creates an instance of the Hit state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("HIT", game);
  }

  /**
   * Enter the Hit state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 10;
    this.game.player.frameY = 4;
  }

  /**
   * Handle input for the Hit state.
   */
  handleInput() {
    if (this.game.player.frameX >= 10 && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
    else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 1);
  }
}

/**
 * The Standing state class, representing the player in a standing state.
 *
 * @class Standing
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Standing extends State implements IStateAction {
  /**
   * Creates an instance of the Standing state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("STANDING", game);
  }

  /**
   * Enter the Standing state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 7;
    this.game.player.frameY = 0;
  }

  /**
   * Handle input for the Standing state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    if (input.includes("ArrowDown")) this.game.player.setState(states.SITTING, 0);
    else if (input.includes("ArrowRight") || input.includes("ArrowLeft")) this.game.player.setState(states.RUNNING, 1);
    else if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

/**
 * The Dead state class, representing the player in a dead state.
 *
 * @class Dead
 * @extends {State}
 * @implements {IStateAction}
 * @property {IGame} game - The game instance.
 */
export class Dead extends State implements IStateAction {
  /**
   * Creates an instance of the Dead state.
   * @param {IGame} game - The game instance.
   */
  constructor(game: IGame) {
    super("DEAD", game);
  }

  /**
   * Enter the Dead state.
   */
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 11;
    this.game.player.frameY = 8;
    this.game.player.vy = 0;
  }

  /**
   * Handle input for the Dead state.
   * @param {string[]} input - The input commands.
   */
  handleInput(input: string[]) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) return;
  }
}
