import { IFloatingMessage } from "../types/shadowhound";

/**
 * The FloatingMessage class implements the IFloatingMessage interface and provides a service for displaying temporary messages on the screen.
 *
 * @class
 * @implements {IFloatingMessage}
 */
export class FloatingMessage implements IFloatingMessage {
  /**
   * Creates a new instance of the FloatingMessage class.
   *
   * @param {string} value - The text of the floating message.
   * @param {number} x - The initial x position of the floating message.
   * @param {number} y - The initial y position of the floating message.
   * @param {number} targetX - The target x position of the floating message.
   * @param {number} targetY - The target y position of the floating message.
   */
  constructor(value: string, x: number, y: number, targetX: number, targetY: number) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.markedForDeletion = false;
    this.timer = 0;
  }

  /**
   * The text of the floating message.
   *
   * @type {string}
   */
  value: string;

  /**
   * The current x position of the floating message.
   *
   * @type {number}
   */
  x: number;

  /**
   * The current y position of the floating message.
   *
   * @type {number}
   */
  y: number;

  /**
   * The target x position of the floating message.
   *
   * @type {number}
   */
  targetX: number;

  /**
   * The target y position of the floating message.
   *
   * @type {number}
   */
  targetY: number;

  /**
   * Whether the floating message is marked for deletion.
   *
   * @type {boolean}
   */
  markedForDeletion: boolean;

  /**
   * The timer of the floating message.
   *
   * @type {number}
   */
  timer: number;

  /**
   * Updates the floating message.
   */
  update() {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y) * 0.03;
    this.timer++;
    if (this.timer > 100) this.markedForDeletion = true;
  }

  /**
   * Draws the floating message on the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "20px Creepster";
    ctx.fillStyle = "white";
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = "black";
    ctx.fillText(this.value, this.x - 2, this.y - 2);
  }
}
