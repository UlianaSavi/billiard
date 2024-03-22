import {
  Ball,
  CANVAS_STANDART_CIRCLE_SIZE,
  CANVAS_STANDART_HEIGHT,
  CANVAS_STANDART_WIDTH,
  CANVAS_STANDART_X_VELOSITY,
  CANVAS_STANDART_Y_VELOSITY,
  CIRCLES_COUNT,
  Position
} from '../constants';
import { getRandomColor } from '../utils';

export class Game {
  private canvas: HTMLCanvasElement | null = null;
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
          vx: CANVAS_STANDART_X_VELOSITY,
          vy: CANVAS_STANDART_Y_VELOSITY,
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

  public initGame = (canvas: HTMLCanvasElement | null) => {
    this.canvas = canvas;
    if (this.canvas) {
      this.canvas.width = CANVAS_STANDART_WIDTH;
      this.canvas.height = CANVAS_STANDART_HEIGHT;
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        const x = 40;
        const y = CANVAS_STANDART_HEIGHT / 3; // Centered

        this.balls = [];
        this.drawBallsTriangle(CIRCLES_COUNT, x, y, CANVAS_STANDART_CIRCLE_SIZE);

        let hitBallNum: number | null = null;
        this.canvas.addEventListener('click', (e) => {
          const pos = this.getMousePosition(e);
          hitBallNum = this.checkIsBallClicked(pos);
          if (hitBallNum !== null) {
            this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
          }
        });

        if (hitBallNum && this.balls[hitBallNum]) {
          this.balls[hitBallNum].draw();
        }
      }
    }
  };

  private getMousePosition = (event: MouseEvent): Position => {
    const rect = this.canvas?.getBoundingClientRect();
    const x = event.clientX - (rect?.left || 0);
    const y = event.clientY - (rect?.top || 0);
    return { x: x, y: y };
  };

  private checkIsBallClicked = (pos: Position): number | null => {
    let res = null;
    this.balls.forEach((ball, i) => {
      const xMax = ball.x + 15;
      const xMin = ball.x - 15;
      const yMax = ball.y + 15;
      const yMin = ball.y - 15;
      if (pos.x >= xMin && pos.x <= xMax && pos.y >= yMin && pos.y <= yMax) {
        res = i;
      }
    });
    return res;
  };

  private animate = (hitBallNum: number) => {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      // Сheck if the ball does not go beyond the table
      if (
        this.balls[hitBallNum].y + this.balls[hitBallNum].vy > this.canvas.height ||
        this.balls[hitBallNum].y + this.balls[hitBallNum].vy < 0
      ) {
        // change vector of moving (-vy) and do it more slower (* 0.5)
        this.balls[hitBallNum].vy = -this.balls[hitBallNum].vy;
        this.balls[hitBallNum].vy = this.balls[hitBallNum].vy * 0.5;
      }
      if (
        this.balls[hitBallNum].x + this.balls[hitBallNum].vx > this.canvas.width ||
        this.balls[hitBallNum].x + this.balls[hitBallNum].vx < 0
      ) {
        // change vector of moving (-vx) and do it more slower (* 0.5)
        this.balls[hitBallNum].vx = -this.balls[hitBallNum].vx;
        this.balls[hitBallNum].vx = this.balls[hitBallNum].vx * 0.5;
      }
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.balls.forEach((ball) => ball.draw());
        this.balls[hitBallNum].x += this.balls[hitBallNum].vx;
        this.balls[hitBallNum].y += this.balls[hitBallNum].vy;
      }
      this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
    }
  };
}
