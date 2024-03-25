import { useRef, useEffect } from 'react';
import './Canvas.css';
import { game } from '../../game/index';

export const Canvas = (props: {
  onBallClick: (ballClikedId: number) => void;
  changeColorData?: {
    ballId: number;
    newBallColor: string;
  };
}) => {
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

  useEffect(() => {
    if (props.changeColorData && props.changeColorData?.newBallColor !== null) {
      game.changeBallColor(props.changeColorData.ballId, props.changeColorData.newBallColor);
    }
  }, [props.changeColorData]);

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
