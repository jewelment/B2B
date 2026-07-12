import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, aspectRatio, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBase64);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1a1a1a] p-6 rounded-2xl flex flex-col gap-6 shadow-2xl relative">
        <div className="flex justify-between items-center text-white">
          <h2 className="text-xl font-bold tracking-widest uppercase">Crop Image</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            Close
          </button>
        </div>
        
        <div className="relative w-full h-[500px] bg-black/50 rounded-xl overflow-hidden border border-white/10">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-white">
            <span className="text-sm font-mono uppercase tracking-widest">Zoom</span>
            <input 
              type="range" 
              min={1} 
              max={3} 
              step={0.1} 
              value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))} 
              className="w-32 accent-white"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-[10px]"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors text-[10px] disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
