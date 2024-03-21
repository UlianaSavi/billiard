import { Canvas } from '../../components/Canvas';
import './GamePage.css';

export const GamePage = () => {
  return (
    <>
      <div className="home">
        <header className="header">
          <h3 className="title">Billiard</h3>
        </header>
        <Canvas></Canvas>
      </div>
    </>
  );
};
