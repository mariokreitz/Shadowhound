import { IStateAction, IState, IGame } from "../types/shadowhound";
import { Dust, Fire } from "./particles.class";

enum states {
  SITTING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
  ROLLING = 4,
  DIVING = 5,
  HIT = 6,
}

class State implements IState {
  constructor(state: string, game: IGame) {
    this.state = state;
    this.game = game;
  }
  state: string;
  game: IGame;
}

export class Sitting extends State implements IStateAction {
  constructor(game: IGame) {
    super("SITTING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 4;
    this.game.player.frameY = 5;
  }

  handleInput(input: string[]) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) this.game.player.setState(states.RUNNING, 1);
    else if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Running extends State implements IStateAction {
  constructor(game: IGame) {
    super("RUNNING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 8;
    this.game.player.frameY = 3;
  }

  handleInput(input: string[]) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.6,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.includes("ArrowDown")) this.game.player.setState(states.SITTING, 0);
    else if (input.includes("ArrowUp")) this.game.player.setState(states.JUMPING, 1);
    else if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Jumping extends State implements IStateAction {
  constructor(game: IGame) {
    super("JUMPING", game);
  }

  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= this.game.player.jumpForce;
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 1;
  }

  handleInput(input: string[]) {
    if (this.game.player.vy > this.game.player.weight) this.game.player.setState(states.FALLING, 1);
    else if (input.includes("Enter")) this.game.player.setState(states.ROLLING, 2);
  }
}

export class Falling extends State implements IStateAction {
  constructor(game: IGame) {
    super("FALLING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 2;
  }

  handleInput() {
    if (this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
  }
}

export class Rolling extends State implements IStateAction {
  constructor(game: IGame) {
    super("ROLLING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 6;
  }

  handleInput(input: string[]) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes("Enter") && this.game.player.onGround()) this.game.player.setState(states.RUNNING, 1);
    else if (!input.includes("Enter") && !this.game.player.onGround()) this.game.player.setState(states.FALLING, 1);
    else if (input.includes("Enter") && input.includes("ArrowUp") && this.game.player.onGround())
      this.game.player.setState(states.JUMPING, 1);
  }
}
