import { useRef, useEffect } from 'react';

export const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = (canvas as HTMLCanvasElement).getContext('2d');
      if (context) {
        context.fillStyle = 'red';
        context.fillRect(0, 0, 500, 500);
      }
    }
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};
