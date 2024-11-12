import { IPlayer, ISitting, IState } from "../types/shadowhound";

enum states {
  SITTING = 0,
  RUNNING = 2,
  JUMPING = 3,
}

class State implements IState {
  constructor(state: string) {
    this.state = state;
  }
  state: string;
}

export class Sitting extends State implements ISitting {
  player: IPlayer;
  constructor(player: IPlayer) {
    super("SITTING");
    this.player = player;
  }

  enter() {
    this.player.frameY = 5;
  }

  handleInput(input) {}
}
