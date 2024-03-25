import { useState } from 'react';
import { Canvas } from '../../components/Canvas';
import { ColorEditorPopup } from '../../components/ColorEditorPopup';
import './GamePage.css';
import { getRandomColor } from '../../utils';

export const GamePage = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [newBallColor, setNewBallColor] = useState(getRandomColor());
  const changeColor = (color: string) => {
    setIsOpenPopup(false);
    setNewBallColor(color);
  };

  const onBallClick = (ballClikedId: number) => {
    setIsOpenPopup(true);
  };

  return (
    <>
      <div className="home">
        {isOpenPopup && <ColorEditorPopup changeColor={changeColor} />}
        <header className="header">
          <h3 className="title">Billiard</h3>
        </header>
        <Canvas onBallClick={onBallClick}></Canvas>
      </div>
    </>
  );
};
