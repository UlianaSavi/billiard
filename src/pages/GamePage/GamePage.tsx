import { useState } from 'react';
import { Canvas } from '../../components/Canvas';
import { ColorEditorPopup } from '../../components/ColorEditorPopup';
import './GamePage.css';

export const GamePage = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [newBallColor, setNewBallColor] = useState<string | null>(null);
  const [ballClikedId, setBallClikedId] = useState<number | null>(null);
  const changeColor = (color: string) => {
    setIsOpenPopup(false);
    setNewBallColor(color);
  };

  const onBallClick = (ballClikedId: number) => {
    setIsOpenPopup(true);
    setBallClikedId(ballClikedId);
  };

  return (
    <>
      <div className="home">
        {isOpenPopup && <ColorEditorPopup changeColor={changeColor} />}
        <header className="header">
          <h3 className="title">Billiard</h3>
        </header>
        {ballClikedId !== null && newBallColor ? (
          <Canvas
            onBallClick={onBallClick}
            changeColorData={{ ballId: ballClikedId, newBallColor: newBallColor }}></Canvas>
        ) : (
          <Canvas onBallClick={onBallClick}></Canvas>
        )}
      </div>
    </>
  );
};
