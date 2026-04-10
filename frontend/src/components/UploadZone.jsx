import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

export default function UploadZone({ onFileSelect, isAnalyzing }) {
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div 
        className={`glass-panel border-2 border-dashed ${isAnalyzing ? 'border-space-700 opacity-50' : 'border-space-border hover:border-space-700 hover:bg-space-800/80'} transition-all duration-300 rounded-3xl p-12 text-center cursor-pointer relative overflow-hidden`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="audio/wav, audio/mp3, audio/m4a" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          disabled={isAnalyzing}
        />
        
        <motion.div
           animate={{ y: [0, -10, 0] }}
           transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
           className="flex justify-center mb-6"
        >
          <UploadCloud className="w-20 h-20 text-gray-400" />
        </motion.div>

        <h3 className="text-2xl font-bold mb-3 text-white">Upload Vocal Sample</h3>
        <p className="text-gray-400 font-medium">Drag & drop your .wav or .mp3 file here</p>
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-space-900/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-space-border rounded-full border-t-white animate-spin mb-4" />
              <p className="text-xl font-display text-white animate-pulse">Running Multimodal Analysis...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
