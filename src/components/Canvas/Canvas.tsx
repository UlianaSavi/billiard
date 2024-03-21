import { useRef, useEffect } from 'react';

export const Canvas = () => {
const canvasRef = useRef(null);

useEffect(() => {
    // Draw canvas here...
}, []);


return <canvas ref={canvasRef} width={500} height={500} />;
}