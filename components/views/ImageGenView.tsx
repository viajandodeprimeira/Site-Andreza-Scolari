import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ImageIcon, Loader2, Sparkles, Send } from '../ui/Icons';
import { generateImage } from '../../services/gemini';

interface ImageGenViewProps {
  goBack: () => void;
}

export const ImageGenView: React.FC<ImageGenViewProps> = ({ goBack }) => {
  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setImageSrc(null);
    setError(null);

    try {
      const base64Image = await generateImage(prompt);
      setImageSrc(base64Image);
    } catch (err) {
      setError("Failed to generate image. Please try a different prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center p-6 border-b border-white/10 z-10 backdrop-blur-md bg-background/50 sticky top-0">
        <button 
          onClick={goBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
             <ImageIcon size={18} />
          </div>
          <h2 className="text-xl font-semibold text-white">Image Generation</h2>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
        
        {/* Main Display */}
        <div className="w-full max-w-2xl aspect-square bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative mb-8 flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
                 <Loader2 size={48} className="animate-spin text-pink-500 mb-4" />
                 <p className="text-white font-medium animate-pulse">Dreaming up pixels...</p>
              </div>
            )}
            
            {!imageSrc && !loading && !error && (
               <div className="text-center p-8 opacity-40">
                  <Sparkles size={64} className="mx-auto mb-4 text-slate-400" />
                  <p className="text-xl font-medium text-slate-300">Ready to create</p>
                  <p className="text-sm text-slate-500 mt-2">Enter a prompt below to start generating</p>
               </div>
            )}

            {error && (
               <div className="text-center p-8 text-red-400">
                  <p>{error}</p>
               </div>
            )}

            {imageSrc && (
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={imageSrc} 
                alt="Generated" 
                className="w-full h-full object-cover"
              />
            )}
        </div>

        {/* Input Controls */}
        <div className="w-full max-w-2xl relative">
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="A futuristic city with flying cars, neon lights, cyberpunk style..."
            className="w-full bg-surface/80 backdrop-blur-xl border border-white/10 text-white rounded-2xl pl-6 pr-16 py-5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-slate-500 shadow-xl"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="absolute right-3 top-3 bottom-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center font-medium shadow-lg"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};