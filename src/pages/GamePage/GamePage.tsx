import { Canvas } from '../../components/Canvas';
import { ColorEditorPopup } from '../../components/ColorEditorPopup';
import './GamePage.css';

export const GamePage = () => {
  const openColorEditorPopup = true;
  const changeColor = (color: string) => {
    console.log(123, color);
  };

  return (
    <>
      <div className="home">
        {openColorEditorPopup && <ColorEditorPopup changeColor={changeColor} />}
        <header className="header">
          <h3 className="title">Billiard</h3>
        </header>
        <Canvas></Canvas>
      </div>
    </>
  );
};
