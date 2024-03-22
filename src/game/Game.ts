import {
  Ball,
  CANVAS_STANDART_CIRCLE_SIZE,
  CANVAS_STANDART_HEIGHT,
  CANVAS_STANDART_WIDTH,
  CIRCLES_COUNT
} from '../constants';
import { getRandomColor } from '../utils';

export class Game {
  private canvas: HTMLCanvasElement | null = null;
  private bacgroundCanvas: HTMLCanvasElement | null = null;
  private balls: Ball[] = [];
  private raf = 0;

  private drawBallsTriangle = (circleCount: number, x: number, y: number, radius: number) => {
    const ctx = this.canvas?.getContext('2d');
    const offsetX = CANVAS_STANDART_CIRCLE_SIZE * 2.2;
    const offsetY = CANVAS_STANDART_CIRCLE_SIZE * 2.2;
    const firstRow = 4;
    const secondRow = 8;
    const thirdRow = 11;
    const fourRow = 13;
    let n = 0;
    if (ctx) {
      for (let i = 0; i < circleCount; i++) {
        // create a new Ball object
        const ball: Ball = {
          x: 0,
          y: 0,
          vx: 0.2,
          vy: 0.5,
          radius: radius,
          color: '',
          draw: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = color;
            ctx.fill();
          }
        };
        // Find circle position and draw circle
        ctx.beginPath();
        if (n <= firstRow) {
          ball.x = x;
          ball.y = y + offsetY * n;
          ctx.arc(x, y + offsetY * n, radius, 0, 2 * Math.PI, false);
        }
        if (n > firstRow && n <= secondRow) {
          ctx.arc(x + offsetX, y + offsetY * (n - firstRow - 0.4), radius, 0, 2 * Math.PI, false);
          ball.x = x + offsetX;
          ball.y = y + (offsetY * (n - firstRow - 0.4) + x / 2);
        }
        if (n > secondRow && n <= thirdRow) {
          ctx.arc(
            x + offsetX + offsetX,
            y + (offsetY * (n - secondRow - 0.8) + x / 2),
            radius,
            0,
            2 * Math.PI,
            false
          );
          ball.x = x + offsetX + offsetX;
          ball.y = y + (offsetY * (n - secondRow - 0.8) + x / 2);
        }
        if (n > thirdRow && n <= fourRow) {
          ctx.arc(
            x + offsetX + offsetX + offsetX,
            y + (offsetY * (n - thirdRow - 0.3) + x / 2),
            radius,
            0,
            2 * Math.PI,
            false
          );
          ball.x = x + offsetX + offsetX + offsetX;
          ball.y = y + (offsetY * (n - thirdRow - 0.3) + x / 2);
        }
        if (n > fourRow) {
          ctx.arc(
            x + offsetX + offsetX + offsetX + offsetX,
            y + (offsetY * (n - fourRow - 0.6) + x),
            radius,
            0,
            2 * Math.PI,
            false
          );
          ball.x = x + offsetX + offsetX + offsetX + offsetX;
          ball.y = y + (offsetY * (n - fourRow - 0.6) + x);
        }
        const color = getRandomColor();
        ball.color = color;
        ctx.fillStyle = color;
        ctx.fill();

        // Add shadow
        ctx.shadowColor = '#00000029';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 2;

        n = n + 1;
        this.balls.push(ball);
      }
    }
  };

  public initGame = (
    canvas: HTMLCanvasElement | null,
    bacgroundCanvas: HTMLCanvasElement | null
  ) => {
    this.canvas = canvas;
    this.bacgroundCanvas = bacgroundCanvas;
    if (this.canvas) {
      this.canvas.width = CANVAS_STANDART_WIDTH;
      this.canvas.height = CANVAS_STANDART_HEIGHT;
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        const x = 40;
        const y = CANVAS_STANDART_HEIGHT / 3; // Centered

        this.drawBorder();
        this.balls = [];
        this.drawBallsTriangle(CIRCLES_COUNT, x, y, CANVAS_STANDART_CIRCLE_SIZE);

        this.canvas.addEventListener('mouseover', (e) => {
          this.raf = window.requestAnimationFrame(this.animate);
        });

        this.canvas.addEventListener('mouseout', (e) => {
          window.cancelAnimationFrame(this.raf);
        });

        this.balls[0].draw();
      }
    }
  };

  private drawBorder = () => {
    const ctx = this.bacgroundCanvas?.getContext('2d');
    if (ctx && this.bacgroundCanvas) {
      ctx.strokeStyle = '#3a3d01';
      ctx.strokeRect(5, 5, this.bacgroundCanvas.width - 10, this.bacgroundCanvas.height - 10);
    }
  };

  private animate = () => {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      // Сheck if the ball does not go beyond the table
      if (
        this.balls[0].y + this.balls[0].vy > this.canvas.height ||
        this.balls[0].y + this.balls[0].vy < 0
      ) {
        this.balls[0].vy = -this.balls[0].vy;
      }
      if (
        this.balls[0].x + this.balls[0].vx > this.canvas.width ||
        this.balls[0].x + this.balls[0].vx < 0
      ) {
        this.balls[0].vx = -this.balls[0].vx;
      }
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.balls[0].draw();
        this.balls[0].x += this.balls[0].vx;
        this.balls[0].y += this.balls[0].vy;
      }
      this.raf = window.requestAnimationFrame(this.animate);
    }
  };
}
