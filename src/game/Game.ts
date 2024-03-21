import {
  CANVAS_STANDART_CIRCLE_SIZE,
  CANVAS_STANDART_HEIGHT,
  CANVAS_STANDART_WIDTH,
  CIRCLES_COUNT
} from '../constants';
import { getRandomColor } from '../utils';

export class Game {
  canvas: HTMLCanvasElement | null = null;

  private createCircle = (
    ctx: CanvasRenderingContext2D,
    circleCount: number,
    x: number,
    y: number,
    radius: number
  ) => {
    let n = 0;
    const offsetX = CANVAS_STANDART_CIRCLE_SIZE * 2;
    const offsetY = CANVAS_STANDART_CIRCLE_SIZE * 2;
    const firstRow = 4;
    const secondRow = 7;
    const thirdRow = 11;
    const fourRow = 13;
    for (let i = 0; i < circleCount; i++) {
      // Find circle position and draw circle
      ctx.beginPath();
      if (n <= firstRow) {
        ctx.arc(x, y + offsetY * n, radius, 0, 2 * Math.PI, false);
      }
      if (n >= firstRow && n <= secondRow) {
        ctx.arc(x + offsetX, y + (offsetY * (n - firstRow) + x / 2), radius, 0, 2 * Math.PI, false);
      }
      if (n > secondRow && n < thirdRow) {
        ctx.arc(
          x + offsetX + offsetX,
          y + (offsetY * (n - secondRow - 0.5) + x / 2),
          radius,
          0,
          2 * Math.PI,
          false
        );
      }
      if (n > thirdRow && n <= fourRow) {
        ctx.arc(
          x + offsetX + offsetX + offsetX,
          y + (offsetY * (n - thirdRow) + x / 2),
          radius,
          0,
          2 * Math.PI,
          false
        );
      }
      if (n > fourRow) {
        ctx.arc(
          x + offsetX + offsetX + offsetX + offsetX,
          y + (offsetY * (n - fourRow) + x),
          radius,
          0,
          2 * Math.PI,
          false
        );
      }
      ctx.fillStyle = getRandomColor();
      ctx.fill();

      // Add shadow
      ctx.shadowColor = '#00000029';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 2;

      n = n + 1;
    }
  };

  public initGame = (canvas: HTMLCanvasElement | null) => {
    this.canvas = canvas;
    if (this.canvas) {
      this.canvas.width = CANVAS_STANDART_WIDTH;
      this.canvas.height = CANVAS_STANDART_HEIGHT;
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        const x = 40;
        const y = 30;
        this.createCircle(ctx, CIRCLES_COUNT, x, y, CANVAS_STANDART_CIRCLE_SIZE);
      }
    }
  };
}
