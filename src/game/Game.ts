import {
  Ball,
  STANDART_CIRCLE_SIZE,
  CANVAS_STANDART_HEIGHT,
  CANVAS_STANDART_WIDTH,
  STANDART_X_VELOSITY,
  STANDART_Y_VELOSITY,
  CIRCLES_COUNT,
  CollisionWithTableBorder,
  Position
} from '../constants';
import { getRandomColor } from '../utils';

export class Game {
  private canvas: HTMLCanvasElement | null = null;
  private balls: Ball[] = [];
  private raf = 0;

  public initGame = (canvas: HTMLCanvasElement | null) => {
    this.canvas = canvas;
    if (this.canvas) {
      this.canvas.width = CANVAS_STANDART_WIDTH;
      this.canvas.height = CANVAS_STANDART_HEIGHT;
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        const x = 40;
        const y = CANVAS_STANDART_HEIGHT / 3; // Centered canvas

        this.balls = [];
        this.drawBallsTriangle(CIRCLES_COUNT, x, y, STANDART_CIRCLE_SIZE);

        let hitBallNum: number | null = null;
        this.canvas.addEventListener('click', (e) => {
          const pos = this.getMousePosition(e);
          hitBallNum = this.checkIsBallClicked(pos);
          if (hitBallNum !== null) {
            this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
          }
        });
      }
    }
  };

  private animate = (hitBallNum: number) => {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const movingBallsIds: number[] = [];

        this.balls.forEach((ballInArr, i) => {
          const ballHitedIdx = this.checkCollisionWithBalls(i, ballInArr);

          if (ballHitedIdx !== null) {
            movingBallsIds.push(i);
            movingBallsIds.push(ballHitedIdx);

            // мяч, который ударился об другой, меняет свое направление на противолположное в следствии удара
            // a ball that hits another one changes its direction to the opposite as a result of the impact
            this.balls[ballHitedIdx].vx = -this.balls[ballHitedIdx].vx;
            this.balls[ballHitedIdx].vx = this.balls[ballHitedIdx].vx * 0.5;
            this.balls[ballHitedIdx].vy = -this.balls[ballHitedIdx].vy;
            this.balls[ballHitedIdx].vy = this.balls[ballHitedIdx].vy * 0.5;

            this.balls[i].x += this.balls[i].vx *= 0.5;
            this.balls[i].y += this.balls[i].vy *= 0.5;
          }
        });

        // Valculated collision logic
        console.log(movingBallsIds); // TODO: сейчас пустой, надо понять - почему
        movingBallsIds.forEach((id) => {
          const collisionWithTableBorder = this.checkCollisionWithTableBorder(this.balls[id]);
          // вычисления тоже тут
          if (collisionWithTableBorder === CollisionWithTableBorder.onY) {
            // change vector of moving (-vy) and do it more slower (* 0.5)
            this.balls[id].vy = -this.balls[id].vy;
            this.balls[id].vy = this.balls[id].vy * 0.5;
          }
          if (collisionWithTableBorder === CollisionWithTableBorder.onX) {
            // change vector of moving (-vx) and do it more slower (* 0.5)
            this.balls[id].vx = -this.balls[id].vx;
            this.balls[id].vx = this.balls[id].vx * 0.5;
          }

          // if ball stoped - add standart velosity (with little randomize) for be able to move it again from his place
          if (Math.sign(this.balls[id].vx) === -1) {
            this.balls[id].vx =
              STANDART_X_VELOSITY + Number(String(Math.random()).slice(0, 3)) - 0.3;
          }
          if (Math.sign(this.balls[id].vy) === -1) {
            this.balls[id].vy = STANDART_Y_VELOSITY;
          }

          // prepare for the next frame
          // if ball is too slow - stop it
          if (this.balls[id].vx <= 0.01 && this.balls[id].vx >= -0.01) {
            this.balls[id].x += 0;
          } else {
            // do velisity slower every frame (friction)
            this.balls[id].x += this.balls[id].vx *= 0.999;
            this.balls[id].y += this.balls[id].vy *= 0.999;
          }

          // increase moving balls velocity for next frame
          this.balls[id].x += this.balls[id].vx;
          this.balls[id].y += this.balls[id].vy;
        });

        this.balls.forEach((ball) => ball.draw());
      }
      this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
    }
  };

  private drawBallsTriangle = (circleCount: number, x: number, y: number, radius: number) => {
    const ctx = this.canvas?.getContext('2d');
    const offsetX = STANDART_CIRCLE_SIZE * 2.2;
    const offsetY = STANDART_CIRCLE_SIZE * 2.2;
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
          vx: STANDART_X_VELOSITY + Number(String(Math.random()).slice(0, 3)), // standart velosity + random number rounded to decimals
          vy: STANDART_Y_VELOSITY,
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

  private checkCollisionWithBalls = (ballHittingIdx: number, ballHitting: Ball): number | null => {
    let res: number | null = null;
    this.balls.map((ballInArr, i) => {
      const dx = ballHitting.x - ballInArr.x;
      const dy = ballHitting.y - ballInArr.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const colliding = distance < ballHitting.radius + ballInArr.radius;
      if (colliding && i !== ballHittingIdx) {
        res = i;
      }
    });
    return res;
  };

  private checkCollisionWithTableBorder = (ball: Ball): CollisionWithTableBorder => {
    if (this.canvas) {
      // check if the ball does not go beyond the table
      if (ball.y + ball.vy > this.canvas.height || ball.y + ball.vy < 0) {
        return CollisionWithTableBorder.onY;
      }
      if (ball.x + ball.vx > this.canvas.width || ball.x + ball.vx < 0) {
        return CollisionWithTableBorder.onX;
      }
    }
    return CollisionWithTableBorder.none;
  };
}
