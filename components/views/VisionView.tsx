import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Loader2, Sparkles, Eye } from '../ui/Icons';
import { AppMode } from '../../types';
import { generateVisionContent } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

interface VisionViewProps {
  goBack: () => void;
}

export const VisionView: React.FC<VisionViewProps> = ({ goBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !prompt.trim() || loading) return;

    setLoading(true);
    setResult('');

    try {
      const analysis = await generateVisionContent(prompt, selectedImage);
      setResult(analysis);
    } catch (error) {
      setResult("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background relative overflow-hidden">
       {/* Background Accent */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

       {/* Header */}
      <header className="flex items-center p-6 border-b border-white/10 z-10 backdrop-blur-md bg-background/50 sticky top-0">
        <button 
          onClick={goBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
             <Eye size={18} />
          </div>
          <h2 className="text-xl font-semibold text-white">Visual Intelligence</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Col: Inputs */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative aspect-video rounded-2xl border-2 border-dashed 
                flex flex-col items-center justify-center cursor-pointer
                transition-all duration-300 group overflow-hidden
                ${selectedImage ? 'border-purple-500/50' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
              `}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Click to upload image</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG supported</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400 ml-1">Ask something about the image</label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe this image, or ask specific questions..."
                  className="w-full h-32 bg-surface/50 border border-white/10 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-500 resize-none"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || !prompt.trim() || loading}
                  className="absolute bottom-3 right-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Analyze
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Output */}
          <div className="min-h-[400px] md:h-auto bg-surface border border-white/10 rounded-2xl p-6 relative overflow-y-auto">
            {!result && !loading && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 opacity-50 pointer-events-none">
                <p>Analysis results will appear here</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="animate-spin text-purple-500" />
                  <p className="text-sm text-purple-300 animate-pulse">Analyzing visual data...</p>
                </div>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="prose prose-invert max-w-none text-zinc-100 [&_*]:text-zinc-100 [&_strong]:text-white [&_strong]:font-bold"
              >
                <ReactMarkdown>{result}</ReactMarkdown>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};