import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './components/views/Home';
import { ChatView } from './components/views/ChatView';
import { AdminView } from './components/views/AdminView';
import { VisionView } from './components/views/VisionView';
import { ImageGenView } from './components/views/ImageGenView';
import { AppMode } from './types';
import { PropertyProvider } from './contexts/PropertyContext';

const App: React.FC = () => {
  // Initialize state based on current URL hash
  const [mode, setModeState] = useState<AppMode>(() => {
    const hash = window.location.hash.replace('#', '');
    switch(hash) {
      case 'admin': return AppMode.ADMIN;
      case 'chat': return AppMode.CHAT;
      case 'vision': return AppMode.VISION;
      case 'studio': return AppMode.IMAGE_GEN;
      default: return AppMode.HOME;
    }
  });

  // Wrapper to update both state and URL hash
  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    switch(newMode) {
      case AppMode.ADMIN: window.location.hash = 'admin'; break;
      case AppMode.CHAT: window.location.hash = 'chat'; break;
      case AppMode.VISION: window.location.hash = 'vision'; break;
      case AppMode.IMAGE_GEN: window.location.hash = 'studio'; break;
      default: window.location.hash = ''; break;
    }
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      switch(hash) {
        case 'admin': setModeState(AppMode.ADMIN); break;
        case 'chat': setModeState(AppMode.CHAT); break;
        case 'vision': setModeState(AppMode.VISION); break;
        case 'studio': setModeState(AppMode.IMAGE_GEN); break;
        default: setModeState(AppMode.HOME); break;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <PropertyProvider>
      <main className="w-full min-h-screen bg-white text-slate-900 font-sans">
        <Home setMode={setMode} />
        
        <AnimatePresence>
          {mode === AppMode.CHAT && (
            <ChatView goBack={() => setMode(AppMode.HOME)} />
          )}
          
          {mode === AppMode.ADMIN && (
            <motion.div 
               initial={{ opacity: 0, x: '100%' }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: '100%' }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-0 z-50 bg-[#09090b]"
            >
              <AdminView goBack={() => setMode(AppMode.HOME)} navigate={setMode} />
            </motion.div>
          )}

          {mode === AppMode.VISION && (
             <motion.div 
             initial={{ opacity: 0, y: '100%' }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: '100%' }}
             className="fixed inset-0 z-50 bg-[#09090b]"
             >
                <VisionView goBack={() => setMode(AppMode.ADMIN)} />
             </motion.div>
          )}

          {mode === AppMode.IMAGE_GEN && (
             <motion.div 
             initial={{ opacity: 0, y: '100%' }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: '100%' }}
             className="fixed inset-0 z-50 bg-[#09090b]"
             >
                <ImageGenView goBack={() => setMode(AppMode.ADMIN)} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PropertyProvider>
  );
};

export default App;