import React, { useState, useRef, useEffect } from 'react';

export default function BoundingBoxDrawer() {
  const [image, setImage] = useState(null);
  const [bbox, setBbox] = useState('');
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawBoundingBox = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    try {
      const box = JSON.parse(bbox);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(box.point1.x, box.point1.y);
      ctx.lineTo(box.point2.x, box.point2.y);
      ctx.lineTo(box.point3.x, box.point3.y);
      ctx.lineTo(box.point4.x, box.point4.y);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#00ff00';
      ctx.font = '24px Arial';
      ctx.fillText(`ID: ${box.id}`, box.point1.x, box.point1.y - 10);
    } catch (error) {
      console.error('Erro ao processar bounding box:', error);
    }
  };

  useEffect(() => {
    if (image) {
      drawBoundingBox();
    }
  }, [image, bbox]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Bounding Box Drawer</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Carregar Imagem:</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bounding Box JSON:</label>
          <textarea
            value={bbox}
            onChange={(e) => setBbox(e.target.value)}
            placeholder='{"id": 994, "point1": {"x": 1300, "y": 0}, "point2": {"x": 1900, "y": 0}, "point3": {"x": 2650, "y": 1520}, "point4": {"x": 1270, "y": 1520}}'
            className="w-full h-24 p-2 border border-gray-300 rounded font-mono text-sm"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setBbox('')}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Limpar Bounding Box
          </button>
          <button
            onClick={() => {
              setImage(null);
              setBbox('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Limpar Imagem
          </button>
        </div>

        {image && (
          <div className="mt-6">
            <img ref={imgRef} src={image} alt="Original" style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="max-w-full border border-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(<BoundingBoxDrawer />)