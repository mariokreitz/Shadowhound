import { IState, CurrentState } from "../types/shadowhound";

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

export class Sitting extends State {
  constructor(player) {
    super("SITTING");
    this.player = player;
  }
}
