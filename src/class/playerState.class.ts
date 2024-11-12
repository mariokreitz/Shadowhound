import { IState, CurrentState } from "../types/shadowhound";

enum states {
  SITTING = 0,
  RUNNING = 2,
  JUMPING = 3,
}

export class State implements IState {
  constructor({ state }: CurrentState) {
    this.state = state;
  }
  state: string;
}
