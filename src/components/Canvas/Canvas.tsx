import { useRef, useEffect } from 'react';
import './Canvas.css';
import { game } from '../../game/index';

export const Canvas = () => {
  const canvasGameRef = useRef<HTMLCanvasElement>(null);
  const canvasBacgroundRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game.initGame(canvasGameRef.current, canvasBacgroundRef.current);
  }, []);

  return (
    <div className="stage">
      <canvas ref={canvasGameRef} id="game-layer" className="canvas"></canvas>
      <canvas ref={canvasBacgroundRef} id="background-layer" className="background canvas"></canvas>
    </div>
  );
};
