import { IPlayer, IStateAction, IState } from "../types/shadowhound";

enum states {
  SITTING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
}

class State implements IState {
  constructor(state: string) {
    this.state = state;
  }
  state: string;
}

export class Sitting extends State implements IStateAction {
  player: IPlayer;
  constructor(player: IPlayer) {
    super("SITTING");
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 5;
  }

  handleInput(input: string[]) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) this.player.setState(states.RUNNING);
  }
}

export class Running extends State implements IStateAction {
  player: IPlayer;
  constructor(player: IPlayer) {
    super("RUNNING");
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 8;
    this.player.frameY = 3;
  }

  handleInput(input: string[]) {
    if (input.includes("ArrowDown")) this.player.setState(states.SITTING);
    else if (input.includes("ArrowUp")) this.player.setState(states.JUMPING);
  }
}

export class Jumping extends State implements IStateAction {
  player: IPlayer;
  constructor(player: IPlayer) {
    super("JUMPING");
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.vy -= this.player.jumpForce;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 1;
  }

  handleInput() {
    if (this.player.vy > this.player.weight) this.player.setState(states.FALLING);
  }
}

export class Falling extends State implements IStateAction {
  player: IPlayer;
  constructor(player: IPlayer) {
    super("FALLING");
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 2;
  }

  handleInput() {
    if (this.player.onGround()) this.player.setState(states.RUNNING);
  }
}
