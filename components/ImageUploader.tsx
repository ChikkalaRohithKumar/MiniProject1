import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon, ImageIcon, XIcon, CheckIcon } from './Icons';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onAnalyze, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 50);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setImagePreview(base64String);
        onImageSelect(file, base64Data);
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setFileName(file.name);
        setUploadProgress(0);
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 10;
          });
        }, 50);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          setImagePreview(base64String);
          onImageSelect(file, base64Data);
          setUploadProgress(100);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileName(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gradient">Upload Endoscopic Image</h2>
      </div>
      
      <Card className="flex-grow border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div 
            className={`relative h-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragOver ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <AnimatePresence mode="wait">
              {imagePreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-full h-full flex flex-col items-center justify-center p-6"
                >
                  <div className="relative max-w-full max-h-full">
                    <img 
                      src={imagePreview} 
                      alt="Endoscopy preview" 
                      className="max-h-80 max-w-full object-contain rounded-lg shadow-lg" 
                    />
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckIcon className="h-5 w-5" />
                      <span>{fileName}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Click to change image</p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-12"
                >
                  <motion.div
                    animate={{ 
                      scale: isDragOver ? 1.1 : 1,
                      rotate: isDragOver ? 5 : 0 
                    }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                      <div className="relative bg-white p-6 rounded-full shadow-lg">
                        <ImageIcon className="h-16 w-16 text-gradient mx-auto" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {isDragOver ? 'Drop your image here' : 'Click to upload or drag & drop'}
                  </h3>
                  <p className="text-gray-500 mb-4">PNG, JPG, or WEBP files</p>
                  <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>
        </CardContent>
      </Card>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">Uploading... {uploadProgress}%</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Button
          onClick={onAnalyze}
          disabled={isLoading || !imagePreview}
          variant="medical"
          size="xl"
          className="w-full h-14 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <UploadIcon className="h-6 w-6" />
              </motion.div>
              Analyzing Image...
            </>
          ) : (
            <>
              <UploadIcon className="h-6 w-6 mr-3" />
              Analyze Image
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};
