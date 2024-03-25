import {
  Ball,
  STANDART_CIRCLE_RADIUS,
  CANVAS_STANDART_HEIGHT,
  CANVAS_STANDART_WIDTH,
  STANDART_X_VELOSITY,
  STANDART_Y_VELOSITY,
  CIRCLES_COUNT,
  CollisionWithTableBorder,
  Position,
  ICollisionWithBallsRes
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
        this.balls = [];
        this.drawBallsTriangle();
        this.balls.forEach((ball) => ball.draw());

        let hitBallNum: number | null = null;
        this.canvas.addEventListener('click', (e) => {
          hitBallNum = this.checkIsBallClicked(this.getMousePosition(e));
          if (hitBallNum !== null) {
            // if ball already was stopped before current click - add a standart velosity for this ball again
            // если мяч остановился после движение, а по нему опять кликнули - добавить ему стандартную скорость заново
            if (this.balls[hitBallNum].vx === 0) {
              this.balls[hitBallNum].vx = STANDART_X_VELOSITY;
            }
            if (this.balls[hitBallNum].vy === 0) {
              this.balls[hitBallNum].vy = STANDART_Y_VELOSITY;
            }
            this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
          }
        });
      }
    }
  };

  public changeBallColor = (id: number, color: string) => {
    this.balls[id].updateColor(color);
    this.balls[id].draw();
  };

  private animate = (hitBallNum: number) => {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const movingBallsIds: number[] = [];
        movingBallsIds.push(hitBallNum);

        this.balls.forEach((ballInArr, i) => {
          const collisionWithBallsRes: ICollisionWithBallsRes | null = this.checkCollisionWithBalls(
            i,
            ballInArr
          );

          if (collisionWithBallsRes.ballHitedIdx !== null) {
            movingBallsIds.push(i);
            movingBallsIds.push(collisionWithBallsRes.ballHitedIdx);

            // calculating of the collisions | вычисления для столкновений

            // шар, который ударился об другой, меняет свое направление на противоположное в следствии удара и теряет часть ускорения
            // a ball that hits another one changes its direction to the opposite as a result of the hit and loses half of the acceleration
            const hitedVx = this.balls[i].vx;
            const hitedVy = this.balls[i].vy;

            this.balls[i].vx += -hitedVx;
            this.balls[i].vx += hitedVx * 0.5;
            this.balls[i].vy += -hitedVy;
            this.balls[i].vy += hitedVy * 0.5;

            // шар, по которому прилетел удар получает часть ускорения от первого шара и противоположное направление
            // a ball that was hit receives part of the acceleration from the first ball and the opposite direction
            this.balls[collisionWithBallsRes.ballHitedIdx].vx += -hitedVx * 0.5;
            this.balls[collisionWithBallsRes.ballHitedIdx].vy += -hitedVy * 0.5;
          }
        });

        // calculating for the moving balls | вычисления для движущихся шаров
        movingBallsIds.forEach((id) => {
          const collisionWithTableBorder = this.checkCollisionWithTableBorder(this.balls[id]);
          if (collisionWithTableBorder === CollisionWithTableBorder.onY) {
            // change vector of moving (-vy) and do it more slower (* 0.5)
            // заменить на противоположный вектор перемещения (-vy) и уменьшить скорость (* 0.5)
            this.balls[id].vy = -this.balls[id].vy;
            this.balls[id].vy = this.balls[id].vy * 0.5;
          }
          if (collisionWithTableBorder === CollisionWithTableBorder.onX) {
            // change vector of moving (-vx) and do it more slower (* 0.5)
            // заменить на противоположный вектор перемещения (-vx) и уменьшить скорость (* 0.5)
            this.balls[id].vx = -this.balls[id].vx;
            this.balls[id].vx = this.balls[id].vx * 0.5;
          }

          // подготовка к след. кадру | prepare for the next frame
          // if ball is too slow - stop it | если шар слишком медленный - остановить его
          if (this.balls[id].vx <= 0.03 && this.balls[id].vx >= -0.03) {
            this.balls[id].vx = 0;
            this.balls[id].vy = 0;
          } else {
            // do velisity slower every frame (friction) | уменьшить скорость движущегося шара для кажд. след. кадра (трение)
            this.balls[id].x += this.balls[id].vx *= 0.997;
            this.balls[id].y += this.balls[id].vy *= 0.997;
          }

          // moving the ball on the velocity vector  | перемещение шара на вектор скорости
          this.balls[id].x += this.balls[id].vx;
          this.balls[id].y += this.balls[id].vy;
        });

        this.balls.forEach((ball) => ball.draw());
      }

      this.raf = window.requestAnimationFrame(() => this.animate(hitBallNum as number));
    }
  };

  // draws balls (15x) as billiard triangle | рисует шары (15шт) в форме бильярдного треугольника
  private drawBallsTriangle = () => {
    const x = 40;
    const y = CANVAS_STANDART_HEIGHT / 3; // Centered canvas | оцентрировать холст
    const radius = STANDART_CIRCLE_RADIUS;
    const ctx = this.canvas?.getContext('2d');
    const offsetX = STANDART_CIRCLE_RADIUS * 2.2;
    const offsetY = STANDART_CIRCLE_RADIUS * 2.2;
    const firstRow = 4;
    const secondRow = 8;
    const thirdRow = 11;
    const fourRow = 13;
    let n = 0;
    if (ctx) {
      for (let i = 0; i < CIRCLES_COUNT; i++) {
        // create a new Ball object | создать новый шар
        const randomVilosity = Number(String(Math.random()).slice(0, 3));
        const ball: Ball = {
          x: 0,
          y: 0,
          vx: STANDART_X_VELOSITY + randomVilosity,
          vy: STANDART_Y_VELOSITY + randomVilosity,
          radius: radius,
          color: null,
          updateColor: function (newColor: string) {
            this.color = newColor;
          },
          draw: function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = this.color || '';
            ctx.fill();
          }
        };
        // calculate ball position and draw ball | вычислить положение шара и написовать его
        if (n <= firstRow) {
          ball.x = x;
          ball.y = y + offsetY * n;
        }
        if (n > firstRow && n <= secondRow) {
          ball.x = x + offsetX;
          ball.y = y + offsetY * (n - firstRow - 0.4);
        }
        if (n > secondRow && n <= thirdRow) {
          ball.x = x + offsetX + offsetX;
          ball.y = y + (offsetY * (n - secondRow - 0.8) + x / 2);
        }
        if (n > thirdRow && n <= fourRow) {
          ball.x = x + offsetX + offsetX + offsetX;
          ball.y = y + (offsetY * (n - thirdRow - 0.3) + x / 2);
        }
        if (n > fourRow) {
          ball.x = x + offsetX + offsetX + offsetX + offsetX;
          ball.y = y + (offsetY * (n - fourRow - 0.6) + x);
        }
        if (!ball.color) {
          const color = getRandomColor();
          ball.color = color;
          ctx.fillStyle = color;
        }
        ctx.fillStyle = ball.color;
        ctx.fill();

        // add shadow  | добавить тень
        ctx.shadowColor = '#00000029';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 2;

        n = n + 1;
        this.balls.push(ball);
      }
    }
  };

  // return mouse pos in x and y | вохвращает позицию мыши по x и y
  public getMousePosition = (event: MouseEvent | React.MouseEvent<HTMLCanvasElement>): Position => {
    const rect = this.canvas?.getBoundingClientRect();
    const x = event.clientX - (rect?.left || 0);
    const y = event.clientY - (rect?.top || 0);
    return { x: x, y: y };
  };

  // check if ball clicked and if yes - returns it's id
  //проверяет был ли сделан клик по мячу и если да - возвращает его id
  public checkIsBallClicked = (pos: Position): number | null => {
    let res = null;
    this.balls.forEach((ball, i) => {
      const xMax = ball.x + STANDART_CIRCLE_RADIUS;
      const xMin = ball.x - STANDART_CIRCLE_RADIUS;
      const yMax = ball.y + STANDART_CIRCLE_RADIUS;
      const yMin = ball.y - STANDART_CIRCLE_RADIUS;
      if (pos.x >= xMin && pos.x <= xMax && pos.y >= yMin && pos.y <= yMax) {
        res = i;
      }
    });
    return res;
  };

  // check if one Ball hit another. Returns ball that was hited id
  // проверить ударяет ли переданный мяч какой-либо из остальных мячей. Функция возвращает мяч, который был ударен
  private checkCollisionWithBalls = (
    ballHittingIdx: number,
    ballHitting: Ball
  ): ICollisionWithBallsRes => {
    const res: ICollisionWithBallsRes = {
      ballHitedIdx: null,
      collisionVector: {
        dx: 0,
        dy: 0
      }
    };
    this.balls.map((ballInArr, i) => {
      const dx = ballInArr.x - ballHitting.x;
      const dy = ballInArr.y - ballHitting.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const colliding = distance <= ballInArr.radius + ballHitting.radius + 0.5;

      if (colliding && i !== ballHittingIdx) {
        res.ballHitedIdx = i;
        res.collisionVector.dx = dx; // can be use for calculate vector of moving | можно юзать для вычисления вектора движения после удара
        res.collisionVector.dy = dy;
      }
    });
    return res;
  };

  // check if the ball collides the table | проверить ударяется ли мяч об стол
  private checkCollisionWithTableBorder = (ball: Ball): CollisionWithTableBorder => {
    if (this.canvas) {
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
