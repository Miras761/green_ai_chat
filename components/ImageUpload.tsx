import React, { useState, useCallback, DragEvent } from 'react';
import { CloseIcon, ImageIcon } from './IconComponents';

interface ImageUploadProps {
  onImageSelect: (file: File | null, previewUrl: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      onImageSelect(null, null);
    }
  }, [onImageSelect]);
  
  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    handleFile(null);
  };

  if (imagePreview) {
    return (
      <div className="relative w-full p-2 border-2 border-dashed border-[#A7F3D0] dark:border-green-800 rounded-lg">
        <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-40 object-contain rounded-md" />
        <button 
          onClick={clearImage}
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors"
          aria-label="Clear image"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-[#10B981] bg-[#ECFDF5] dark:bg-green-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-[#34D399] dark:hover:border-green-600 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
    >
      <ImageIcon className="w-8 h-8 text-[#10B981] dark:text-[#34D399]" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-[#059669] dark:text-[#A7F3D0]">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, or WEBP</p>
      <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
    </label>
  );
};

export default ImageUpload;