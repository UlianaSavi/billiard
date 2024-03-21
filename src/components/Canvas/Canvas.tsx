import { useRef, useEffect } from 'react';
import './Canvas.css';
import { CANVAS_STANDART_CIRCLE_SIZE, CANVAS_STANDART_WIDTH, CIRCLES_COUNT } from '../../constants';
import { getRandomColor } from '../../utils';

export const Canvas = () => {
  const canvasBackgroundRef = useRef<HTMLCanvasElement>(null);
  const canvasGameRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasGameRef.current;

    if (canvas) {
      canvas.width = CANVAS_STANDART_WIDTH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const x = 40;
        const y = 40;
        createCircle(ctx, CIRCLES_COUNT, x, y, CANVAS_STANDART_CIRCLE_SIZE);
      }
    }
  }, []);

  const createCircle = (
    ctx: CanvasRenderingContext2D,
    circleCount: number,
    x: number,
    y: number,
    radius: number
  ) => {
    let n = 0;
    const offsetX = x - 7;
    const offsetY = y - 7;
    const firstRow = 4;
    const secondRow = 7;
    for (let i = 0; i < circleCount; i++) {
      // Draw circle
      ctx.beginPath();
      if (n <= firstRow) {
        ctx.arc(x + offsetX * n, y, radius, 0, 2 * Math.PI, false);
      }
      if (n >= firstRow && n <= secondRow) {
        ctx.arc(x + (offsetX * (n - firstRow) + x / 2), y + offsetY, radius, 0, 2 * Math.PI, false);
      }
      if (n >= secondRow && n <= 11) {
        ctx.arc(x + (offsetX * (n - firstRow) + x / 2), y + offsetY, radius, 0, 2 * Math.PI, false);
      }
      // if (n <= 13) {
      //   ctx.arc(x + offsetX, y + y * n, radius, 0, 2 * Math.PI, false);
      // }
      // if (n > 13) {
      //   ctx.arc(x + offsetX, y + y * n, radius, 0, 2 * Math.PI, false);
      // }
      ctx.fillStyle = getRandomColor();
      ctx.fill();

      // Add shadow
      ctx.shadowColor = '#00000029';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 2;

      n = n + 1;
    }
  };

  return (
    <div className="stage">
      <canvas ref={canvasGameRef} id="game-layer" className="canvas"></canvas>
      <canvas
        ref={canvasBackgroundRef}
        id="background-layer"
        className="background canvas"></canvas>
    </div>
  );
};
