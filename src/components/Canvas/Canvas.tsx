import { useRef, useEffect } from 'react';
import './Canvas.css';
import { game } from '../../game/index';

export const Canvas = (props: { onBallClick: (ballClikedId: number) => void }) => {
  const canvasGameRef = useRef<HTMLCanvasElement>(null);
  const onContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coordinates = game.getMousePosition(e);
    const ballClikedId = game.checkIsBallClicked(coordinates);
    if (ballClikedId !== null) {
      props.onBallClick(ballClikedId);
    }
  };

  useEffect(() => {
    game.initGame(canvasGameRef.current);
  }, []);
  // useEffect(() => {
  //   game.changeBallColor(props.changedColor, props.ballId);
  // }, [props.changedColor]);

  return (
    <div className="stage">
      <canvas
        onContextMenu={onContextMenu}
        ref={canvasGameRef}
        id="game-layer"
        className="canvas"></canvas>
      <canvas id="background-layer" className="background canvas"></canvas>
    </div>
  );
};
