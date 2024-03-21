import { useRef, useEffect } from 'react';
import './Canvas.css';
import { CIRCLES_COUNT } from '../../constants';
import { getRandomColor } from '../../utils';

export const Canvas = () => {
  const canvasBackgroundRef = useRef(null);
  const canvasGameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasGameRef.current;

    if (canvas) {
      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        const x = 50;
        const y = 50;
        const radius = 15;
        createCircle(ctx, CIRCLES_COUNT, x, y, radius);
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
    for (let i = 0; i < circleCount; i++) {
      ctx.beginPath();
      ctx.arc(x + 30 * n, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = getRandomColor();
      ctx.fill();
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
