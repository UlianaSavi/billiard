import { useRef, useEffect } from 'react';
import './Canvas.css';
import { game } from '../../game/index';

export const Canvas = () => {
  const canvasGameRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game.initGame(canvasGameRef.current);
  }, []);

  return (
    <div className="stage">
      <canvas ref={canvasGameRef} id="game-layer" className="canvas"></canvas>
      <canvas id="background-layer" className="background canvas"></canvas>
    </div>
  );
};
