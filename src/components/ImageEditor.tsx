import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Point {
  x: number;
  y: number;
}

interface Measurement {
  start: Point;
  end: Point;
  label: string;
}

interface ImageEditorProps {
  image: File;
  onSave: (editedImageBlob: Blob) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentStart, setCurrentStart] = useState<Point | null>(null);
  const [currentLabel, setCurrentLabel] = useState('1000 мм');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      const maxWidth = 900;
      const maxHeight = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      setImgElement(img);
      setImageLoaded(true);
      redraw(img, []);
    };
    img.src = URL.createObjectURL(image);
  }, [image]);

  const redraw = (img: HTMLImageElement, measurementsList: Measurement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';

    measurementsList.forEach((m) => {
      ctx.beginPath();
      ctx.moveTo(m.start.x, m.start.y);
      ctx.lineTo(m.end.x, m.end.y);
      ctx.stroke();

      const arrowSize = 10;
      const angle = Math.atan2(m.end.y - m.start.y, m.end.x - m.start.x);
      
      ctx.beginPath();
      ctx.moveTo(m.end.x, m.end.y);
      ctx.lineTo(
        m.end.x - arrowSize * Math.cos(angle - Math.PI / 6),
        m.end.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(m.end.x, m.end.y);
      ctx.lineTo(
        m.end.x - arrowSize * Math.cos(angle + Math.PI / 6),
        m.end.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();

      const midX = (m.start.x + m.end.x) / 2;
      const midY = (m.start.y + m.end.y) / 2;
      
      const textMetrics = ctx.measureText(m.label);
      const padding = 6;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(
        midX - textMetrics.width / 2 - padding,
        midY - 12 - padding,
        textMetrics.width + padding * 2,
        24 + padding * 2
      );
      
      ctx.fillStyle = '#ef4444';
      ctx.fillText(m.label, midX - textMetrics.width / 2, midY + 6);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentStart({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStart || !imgElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tempMeasurement: Measurement = {
      start: currentStart,
      end: { x, y },
      label: currentLabel
    };

    redraw(imgElement, [...measurements, tempMeasurement]);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStart || !imgElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMeasurement: Measurement = {
      start: currentStart,
      end: { x, y },
      label: currentLabel
    };

    const updatedMeasurements = [...measurements, newMeasurement];
    setMeasurements(updatedMeasurements);
    setIsDrawing(false);
    setCurrentStart(null);
    redraw(imgElement, updatedMeasurements);
  };

  const handleUndo = () => {
    if (measurements.length === 0 || !imgElement) return;
    const newMeasurements = measurements.slice(0, -1);
    setMeasurements(newMeasurements);
    redraw(imgElement, newMeasurements);
  };

  const handleClear = () => {
    if (!imgElement) return;
    setMeasurements([]);
    redraw(imgElement, []);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Редактор разметки</h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="measurement-label" className="text-gray-700 text-sm">
                Размер для следующей линии
              </Label>
              <Input
                id="measurement-label"
                type="text"
                value={currentLabel}
                onChange={(e) => setCurrentLabel(e.target.value)}
                placeholder="1000 мм"
                className="h-10"
              />
            </div>
            
            <Button onClick={handleUndo} variant="outline" disabled={measurements.length === 0}>
              <Icon name="Undo" className="mr-2" size={18} />
              Отменить
            </Button>
            
            <Button onClick={handleClear} variant="outline" disabled={measurements.length === 0}>
              <Icon name="Trash2" className="mr-2" size={18} />
              Очистить
            </Button>
            
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Icon name="Check" className="mr-2" size={18} />
              Сохранить
            </Button>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Инструкция:</strong> Нажмите на изображение и протяните линию, чтобы указать размер. 
              Введите значение размера в поле выше перед рисованием.
            </p>
            <p className="text-xs text-gray-500">
              Размеченное изображение будет отправлено вместе с заявкой на email.
            </p>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="cursor-crosshair max-w-full"
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            {!imageLoaded && (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Загрузка изображения...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
